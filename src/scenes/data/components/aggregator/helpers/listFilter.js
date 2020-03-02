export default function listFilter(list, names) {
    const filteredList = [];

    for (let i = 0; i < list.length; i += 1) {
        if (names[list[i].summary].selected) {
            filteredList.push(list[i]);
        }
    }

    return filteredList;
}
