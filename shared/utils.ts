export const pathBySelector = (fun: (a) => {}) =>
    fun
        .toString()
        .split('=>')[1]
        .trim();
