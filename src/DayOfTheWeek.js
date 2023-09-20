import { React } from 'react';
import SunTimeManager from '../src/services/SunTimeManager';

const DayOfTheWeek = (context) => {
	const { config: { latitude,
		longitude, timezone: tZone, data: date }} = context;

	return <div>{
		SunTimeManager.getDayOfTheWeek(
			date, latitude, longitude, tZone
		)
	}
	</div>;
};

export default DayOfTheWeek;
