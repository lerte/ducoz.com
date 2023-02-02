export default function ({ route, store, redirect }) {
  if (/^\/admin\//i.test(route.path)) {
    if (store.state.user.isAdmin) {
      return redirect('/admin')
    }
  } else {
    if (store.state.user) {
      return redirect('/profile')
    }
  }
}
