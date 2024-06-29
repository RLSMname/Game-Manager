export const storeAction = (action, data) => {
    const storedActions = JSON.parse(localStorage.getItem('storedActions')) || [];
    storedActions.push({ action, data });
    localStorage.setItem('storedActions', JSON.stringify(storedActions));
}

export const removeActionFromStorage = (action, data) => {
    const storedActions = JSON.parse(localStorage.getItem('storedActions')) || [];
    const updatedActions = storedActions.filter(item => item.action !== action || JSON.stringify(item.data) !== JSON.stringify(data));
    localStorage.setItem('storedActions', JSON.stringify(updatedActions));
}