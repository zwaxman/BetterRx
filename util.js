export const sort = (a, b) => {
    a = a.name.toLowerCase()
    b = b.name.toLowerCase()
    if (a>b) {
        return 1
    } else if (a<b) {
        return -1
    } else {
        return 0
    }
}