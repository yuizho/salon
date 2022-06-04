import { Story, Meta } from '@storybook/react/types-6-0';
import Hands from './Hands';

export default {
  title: 'Organisms/Hands',
  component: Hands,
} as Meta;

const Template: Story = ({ values }) => <Hands values={values} />;

export const Default = Template.bind({});
Default.args = {
  values: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55'],
};
