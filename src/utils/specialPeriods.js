export default {
  miku2021 () {
    return (
      new Date(2021, 7, 31, 0, 0, 0).getTime() <= Date.now() &&
      Date.now() < new Date(2021, 8, 1, 0, 0, 0).getTime()
    )
  }
}