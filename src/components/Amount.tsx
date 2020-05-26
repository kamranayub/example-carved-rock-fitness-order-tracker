import React, { FC } from "react";

const Amount: FC<{ amount: number }> = ({ amount }) => (
  <>${amount.toFixed(2)}</>
);

export default Amount;
