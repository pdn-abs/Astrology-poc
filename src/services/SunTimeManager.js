import { select } from '@laufire/utils/collection';
import dayjs from 'dayjs';
import SunCalc from 'suncalc';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { peek } from '@laufire/utils/debug';

dayjs.extend(utc);
dayjs.extend(timezone);

const SunTimeManager = {
	getCalculatedSunTimes: (data) => {
		const { tZone, latitude, longitude, date } = data;
		const UTCDate = dayjs(date, tZone);
		const sunTimes = SunCalc.getTimes(
			UTCDate, latitude, longitude, 0
		);
		const timeList = select(sunTimes, ['sunrise', 'sunset']);

		return {
			...data,
			sunrise: dayjs(timeList.sunrise, tZone),
			sunset: dayjs(timeList.sunset, tZone),
		};
	},

	getDayOfTheWeek: (
		date, latitude, longitude, tZone
	) => {
		const sunTimeData = peek(SunTimeManager
			.getCalculatedSunTimes({ date, latitude, longitude, tZone }));
		const dateTime = dayjs(sunTimeData.date);
		const { sunrise } = sunTimeData;

		return dateTime.isSame(sunrise) || dateTime.isAfter(sunrise)
			? dateTime.format('dddd')
			: dateTime.subtract(1, 'day').format('dddd');
	},

};

export default SunTimeManager;
