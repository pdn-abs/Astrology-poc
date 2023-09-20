import { React } from 'react';
import './App.scss';
import DayOfTheWeek from './DayOfTheWeek';

const App = (context) => {
	const { config: { testData }} = context;

	return <div className="App" role="App">
		{
			testData.map((date, id) =>
				<DayOfTheWeek key={ id } { ...{ ...context, data: date } }/>)
		}
	</div>;
};

export default App;
