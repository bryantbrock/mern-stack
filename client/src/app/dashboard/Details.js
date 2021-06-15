import React, { Component } from 'react'
import {Currency} from 'app/dashboard/utils'
import {connect} from 'react-redux'


const tableHeaders = [
  'Date',
  'Delta',
  'Details',
  'Bank',
]

const enhance = connect(
  state => ({
    transactions: state.finances.transactions
  })
)

export class Details extends Component {
  constructor(props) {
    super(props)
    this.state = {tab: 'Transactions'}
  }
  render() {
    const {transactions} = this.props

    return <div>
      <table className="details">
        <thead>
          <tr>
            {tableHeaders.map(name => <th>{name}</th>)}
          </tr>
        </thead>
        <tbody>
          {transactions.map(inst =>
            inst.transactions.map(({date, amount, name}) =>
              <tr>
                <td>{date}</td>
                <td><Currency value={amount} /></td>
                <td>{name}</td>
                <td>{inst.institution}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  }
}

export default enhance(Details)
