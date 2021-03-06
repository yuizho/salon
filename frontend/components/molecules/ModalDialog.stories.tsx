import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './ModalDialog';

export default {
  title: 'Molecules/ModalDialog',
  component: Component,
} as Meta;

const Template: Story = ({ message, open, setOpen, onClickOK }) => {
  return <Component message={message} open={open} setOpen={setOpen} onClickOK={onClickOK} />;
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  setOpen: (b: boolean) => console.log(b),
  title: 'タイトルです！！',
  message: '選択したユーザを部屋からキックします！よろしいですか？',
  onClickOK: () => alert('OK button is clicked!!!'),
};
