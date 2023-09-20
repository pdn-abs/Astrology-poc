import SunCalc from 'suncalc';
import SunTimeManager from './SunTimeManager';
import * as collection from '@laufire/utils/collection';
import * as dayjs from 'dayjs';

jest.mock('dayjs', () => jest.fn());

describe('sunTimeManager', () => {
	const { getCalculatedSunTimes, isNotBefore, getDayOfTheWeek }
	= SunTimeManager;

	const date = Symbol('date');
	const latitude = Symbol('latitude');
	const longitude = Symbol('longitude');
	const tZone = Symbol('tZone');

	test('getCalculatedSunTimes', () => {
		const UTCDate = Symbol('UTCDate');
		const sunTimes = Symbol('sunTimes');
		const sunrise = Symbol('sunrise');
		const sunset = Symbol('sunset');
		const timeList = {
			sunrise: Symbol('sunrise'),
			sunset: Symbol('sunset'),
		};
		const data = { tZone, latitude, longitude, date };

		jest.spyOn(dayjs, 'default').mockReturnValueOnce(UTCDate);
		jest.spyOn(dayjs, 'default').mockReturnValueOnce(sunrise);
		jest.spyOn(dayjs, 'default').mockReturnValueOnce(sunset);
		jest.spyOn(SunCalc, 'getTimes').mockReturnValue(sunTimes);
		jest.spyOn(collection, 'select').mockReturnValue(timeList);

		const result = getCalculatedSunTimes(data);

		expect(dayjs.default).toHaveBeenCalledWith(date, tZone);
		expect(dayjs.default).toHaveBeenCalledWith(timeList.sunrise, tZone);
		expect(dayjs.default).toHaveBeenCalledWith(timeList.sunset, tZone);
		expect(SunCalc.getTimes).toHaveBeenCalledWith(
			UTCDate, latitude, longitude, 0
		);
		expect(collection.select)
			.toHaveBeenCalledWith(sunTimes, ['sunrise', 'sunset']);
		expect(result).toEqual({ ...data, sunrise, sunset });
	});
	describe('isNotBefore', () => {
		test('if isSame returns true & isAfter returns false', () => {
			const isSame = jest.fn(() => true);
			const isAfter = jest.fn(() => false);
			const dateTime = { isSame, isAfter };
			const sunrise = Symbol('sunrise');

			const result = isNotBefore(dateTime, sunrise);

			expect(isSame).toHaveBeenCalledWith(sunrise);
			expect(isAfter).not.toHaveBeenCalledWith(sunrise);

			expect(result).toEqual(true);
		});
		test('if isSame returns false & isAfter returns true', () => {
			const isSame = jest.fn(() => false);
			const isAfter = jest.fn(() => true);
			const dateTime = { isSame, isAfter };
			const sunrise = Symbol('sunrise');

			const result = isNotBefore(dateTime, sunrise);

			expect(isSame).toHaveBeenCalledWith(sunrise);
			expect(isAfter).toHaveBeenCalledWith(sunrise);

			expect(result).toEqual(true);
		});
		test('if isSame returns false & isAfter returns false', () => {
			const isSame = jest.fn(() => false);
			const isAfter = jest.fn(() => false);
			const dateTime = { isSame, isAfter };
			const sunrise = Symbol('sunrise');

			const result = isNotBefore(dateTime, sunrise);

			expect(isSame).toHaveBeenCalledWith(sunrise);
			expect(isAfter).toHaveBeenCalledWith(sunrise);

			expect(result).toEqual(false);
		});
	});
	describe('getDayOfTheWeek', () => {
		const sunrise = Symbol('sunrise');
		const sunTimeData = { tZone, latitude, longitude, date, sunrise };

		test('if isNotBefore returns true', () => {
			const dayOfTheWeek = Symbol('dayOfTheWeek');
			const format = jest.fn();
			const dateTime = { format };

			jest.spyOn(SunTimeManager, 'getCalculatedSunTimes')
				.mockReturnValue(sunTimeData);
			jest.spyOn(dayjs, 'default').mockReturnValue(dateTime);
			jest.spyOn(SunTimeManager, 'isNotBefore').mockReturnValue(true);
			format.mockReturnValue(dayOfTheWeek);

			const result = getDayOfTheWeek(
				date, latitude, longitude, tZone
			);

			expect(SunTimeManager.getCalculatedSunTimes)
				.toHaveBeenCalledWith({ date, latitude, longitude, tZone });
			expect(dayjs.default).toHaveBeenCalledWith(date);
			expect(SunTimeManager.isNotBefore)
				.toHaveBeenCalledWith(dateTime, sunrise);

			expect(result).toEqual(dayOfTheWeek);
		});

		test('if isNotBefore returns false', () => {
			const dayOfTheWeek = Symbol('dayOfTheWeek');
			const format = jest.fn();
			const subtract = jest.fn(() => ({ format }));
			const dateTime = { subtract };

			jest.spyOn(SunTimeManager, 'getCalculatedSunTimes')
				.mockReturnValue(sunTimeData);
			jest.spyOn(dayjs, 'default').mockReturnValue(dateTime);
			jest.spyOn(SunTimeManager, 'isNotBefore').mockReturnValue(false);
			format.mockReturnValue(dayOfTheWeek);

			const result = getDayOfTheWeek(
				date, latitude, longitude, tZone
			);

			expect(SunTimeManager.getCalculatedSunTimes)
				.toHaveBeenCalledWith({ date, latitude, longitude, tZone });
			expect(dayjs.default).toHaveBeenCalledWith(date);
			expect(SunTimeManager.isNotBefore)
				.toHaveBeenCalledWith(dateTime, sunrise);

			expect(result).toEqual(dayOfTheWeek);
		});
	});
});
