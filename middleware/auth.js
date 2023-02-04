export default function ({ route, store, redirect }) {
  if (!store.state.user) {
    return redirect(`/login?to=${route.path}`)
  }
  if (/^\/admin/i.test(route.path)) {
    // 访问的是admin内容，不是管理员的话，返回首页
    if (!store.state.user.isAdmin) {
      return redirect('/')
    }
  }
}
