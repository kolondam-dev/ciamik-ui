import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from './DateRangePicker';
import React from 'react';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Patterns/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

export const Default: Story = {
  render: (args) => {
    const [start, setStart] = React.useState<Date | null>(new Date());
    const [end, setEnd] = React.useState<Date | null>(new Date());
    const [compare, setCompare] = React.useState(false);

    return (
      <div style={{ height: '300px' }}>
        <DateRangePicker
          {...args}
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
          compare={compare}
          onCompareChange={setCompare}
        />
      </div>
    );
  },
};
