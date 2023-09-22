import { render, screen } from '@testing-library/react';
import context from './core/context';
import { React } from 'react';
import App from './App';
import * as DayOfTheWeek from './DayOfTheWeek';

describe('App', () => {
	test('renders the component appropriately', () => {
		const { container: { children }} = render(App(context));
		const [rootElement] = children;

		expect(rootElement).toBeInTheDocument();
	});
	test('Displays the DayOfTheWeek', () => {
		jest.spyOn(DayOfTheWeek, 'default')
			.mockReturnValue(<div role="DayOfTheWeek"/>);

		render(<App { ...context }/>);

		context.config.testData.forEach((date, id) => {
			expect(screen.getAllByRole('DayOfTheWeek')[id])
				.toBeInTheDocument();
			expect(DayOfTheWeek.default)
				.toHaveBeenCalledWith({ ...context, data: date }, {});
		});
	});
});
