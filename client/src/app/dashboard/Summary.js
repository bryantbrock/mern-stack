import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Currency} from 'app/dashboard/utils'

const enhance = connect(
  state => ({
    summary: state.finances.summary,
  })
)

class Summary extends Component {
  render() {
    const {summary:
      {overUnder, income, expenses}
    } = this.props

    const wrapper = 'flex'
    const title = 'font-bold text-2xl pr-4'

    return <div className="pr-20">
      <div>
        <div className={wrapper}>
          <label className={title}>Profit</label>
          <Currency value={overUnder} className="pb-5 text-xl" />
        </div>
        <div className={wrapper}>
          <label className={title}>Income</label>
          <Currency value={income} className="pb-5 text-xl" />
        </div>
        <div className={wrapper}>
          <label className={title}>Expenses</label>
          <Currency value={expenses} className="pb-5 text-xl" />
        </div>
      </div>

    </div>
  }
}

export default enhance(Summary)
