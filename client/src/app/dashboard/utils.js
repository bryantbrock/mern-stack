import React from 'react'

export const Currency = ({value, className}) => {

  // TODO: make numbers change color if negative/positive

  const amount = value < 0 ?
    Math.abs(value) :
    -Math.abs(value)

  // Create our number formatter.
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return <span className={className}>{formatter.format(amount)}</span>
}