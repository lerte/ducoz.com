export default function ({ store, redirect }) {
  if (store.state.user) {
    if (store.state.user.isAdmin) {
      return redirect('/admin')
    } else {
      return redirect('/user')
    }
  }
}
