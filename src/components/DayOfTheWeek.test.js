import DayOfTheWeek from './DayOfTheWeek';
import { render } from '@testing-library/react';
import context from '../core/context';
import SunTimeManager from '../services/SunTimeManager';
import { React } from 'react';
import { rndString } from '@laufire/utils/random';

describe('DayOfTheWeek', () => {
	test('renders the component appropriately', () => {
		const { container: { children }} = render(DayOfTheWeek(context));
		const [rootElement] = children;

		expect(rootElement).toBeInTheDocument();
	});
	test('Finds the day of the week', () => {
		const rndStringLength = 4;
		const { config: { latitude,
			longitude, timezone: tZone, data: date }} = context;

		jest.spyOn(SunTimeManager, 'getDayOfTheWeek')
			.mockReturnValue(rndString(rndStringLength));

		render(<DayOfTheWeek { ...context }/>);

		expect(SunTimeManager.getDayOfTheWeek)
			.toHaveBeenCalledWith(
				date, latitude, longitude, tZone
			);
	});
});
