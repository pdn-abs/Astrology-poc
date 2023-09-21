import { render, screen } from '@testing-library/react';
import context from './core/context';
import { React } from 'react';
import App from './App';

describe('App', () => {
	test('renders the component appropriately', () => {
		const { container: { children }} = render(App(context));
		const [rootElement] = children;

		expect(rootElement).toBeInTheDocument();
	});
	test('Displays the DayOfTheWeek', () => {
		render(<App { ...context }/>);

		context.config.testData.forEach((date, id) => {
			expect(screen.getAllByRole('DayOfTheWeek')[id])
				.toBeInTheDocument();
		});
	});
});
