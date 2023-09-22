import { render } from '@testing-library/react';
import context from './core/context';
import { React } from 'react';
import App from './App';
import * as DayOfTheWeek from './components/DayOfTheWeek';

describe('App', () => {
	test('renders the component appropriately', () => {
		const { container: { children }} = render(App(context));
		const [rootElement] = children;

		expect(rootElement).toBeInTheDocument();
	});
	test('Displays the DayOfTheWeek', () => {
		jest.spyOn(DayOfTheWeek, 'default')
			.mockReturnValue(<div/>);

		const { container: { children }} = render(App(context));
		const [rootElement] = children;

		expect(rootElement).toBeInTheDocument();

		render(<App { ...context }/>);

		context.config.testData.forEach((date, id) => {
			expect(children[0].childNodes[id])
				.toBeInTheDocument();
			expect(DayOfTheWeek.default.mock.calls[id][0])
				.toEqual({ ...context, data: date });
		});
	});
});
