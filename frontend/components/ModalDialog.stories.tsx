import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './ModelDialog';

export default {
  title: 'ModalDialog',
  component: Component,
} as Meta;

const Template: Story = ({ title, content, open, setOpen, onClickOK }) => {
  return (
    <Component
      title={title}
      content={content}
      open={open}
      setOpen={setOpen}
      onClickOK={onClickOK}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  open: true,
  setOpen: (b: boolean) => console.log(b),
  title: 'タイトルです！！',
  content: '選択したユーザを部屋からキックします！よろしいですか？',
  onClickOK: () => alert('OK button is clicked!!!'),
};
