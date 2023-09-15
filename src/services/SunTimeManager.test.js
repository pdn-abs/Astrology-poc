import SunCalc from 'suncalc';
import SunTimeManager from './SunTimeManager';
import * as collection from '@laufire/utils/collection';
import * as dayjs from 'dayjs';
import { rndValue } from '@laufire/utils/random';

jest.mock('dayjs', () => jest.fn());

describe('sunTimeManager', () => {
	const { getCalculatedSunTimes, isNotBefore } = SunTimeManager;

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
	test('isNotBefore', () => {
		const isSame = jest.fn();
		const isAfter = jest.fn();
		const dateTime = { isSame, isAfter };
		const sunrise = Symbol('sunrise');
		const sameValue = rndValue([true, false]);
		const afterValue = rndValue([true, false]);

		jest.spyOn(dateTime, 'isSame').mockReturnValue(sameValue);
		jest.spyOn(dateTime, 'isAfter').mockReturnValue(afterValue);

		const result = isNotBefore(dateTime, sunrise);

		expect(dateTime.isSame).toHaveBeenCalledWith(sunrise);
		// eslint-disable-next-line jest/no-conditional-expect
		sameValue || expect(dateTime.isAfter).toHaveBeenCalledWith(sunrise);
	});
});
