import { React } from 'react';
import './App.scss';
import SunTimeManager from './services/SunTimeManager';

const App = (context) => {
	const { config: { testData, latitude,
		longitude, timezone: tZone }} = context;

	return <div className="App">
		{testData.map((date, id) =>
			<div key={ id }>{SunTimeManager.getDayOfTheWeek(
				date, latitude, longitude, tZone
			)}
			</div>)}
	</div>;
};

export default App;
