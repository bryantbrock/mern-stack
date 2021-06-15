export const modifyUser = user => {
  const {bankTokens, uid, email} = user.data
  const institutesOnly = bankTokens.map(({institute}) => ({institute}))

  return {uid, email, connectedInstitutes: institutesOnly}
}