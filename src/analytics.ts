// считаем клики по документу
function createAnalytics(): object {
    let counter = 0;
    let isDestroyed: boolean = false;
    const listener = (): number => counter++;
    document.addEventListener("click", listener)
    return {
        destroy(): void {
            document.removeEventListener("click", listener);
            isDestroyed = true
        },
        getClick(): void {
            if (isDestroyed) {
                return console.log('Аналитика отключена!')
            }
            return console.log('Кликов:', counter)
        }
    }
}

window['analytics'] = createAnalytics();
//analytics.getClick()

