interface IMappingItem {
    date: Date
    day?: string
    dayIndex: number
    timeSpan: TimeSpan
}

class TimeSpan {
    constructor( min: number) {
        this.set(min);
    }
    min: number;
    public set(min: number)
    {
       this.min = min;
    }
}

function executeScript() {
    const dataTestIdAttribute = 'data-test-id';
    const boxAttributeValueRegex = '^\\w{3}_\\d{4}-\\d{2}-\\d{2}';
    const timeSelector = `[${dataTestIdAttribute}="day-summary"]`;
    console.clear();
    const regex = new RegExp(boxAttributeValueRegex);
    const nodes = [...document.querySelectorAll(`[${dataTestIdAttribute}`)]
        .filter(node => regex.test(node.getAttribute(dataTestIdAttribute)))
        .map(mapItems);

    console.log(groupBy(nodes, n => new Date(n.date.getDate()).setDate(- n.dayIndex)));

    function groupBy(list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }



    function mapItems(node) {
        console.log(node.innerHTML.split(' ')[0])
        const innerNode = node.querySelector(timeSelector);
        //innerNode.innerHTML =  innerNode.innerHTML.split(' ')[0];
        let timeSpan = new TimeSpan(0);
        if (innerNode) {
            const parsedTime = innerNode.innerHTML.split(' ')[0];
            const splits = parsedTime.split('h');
            timeSpan.set(((splits[0] ?? 0) * 60 ) +  splits[1] ?? 0)
            innerNode.innerHTML = '';
        }

        const dateString = node.getAttribute(dataTestIdAttribute)
            .split('_')[1]
            .replace('_', '.');
        const date = new Date(dateString);

        return <IMappingItem>{
            date,
            day: innerNode?.innerHTML,
            dayIndex: date.getDay() === 0 ? 7 : date.getDay(),
            timeSpan,
        };
    }

    nodes.forEach(item => {
            console.log(item)
        }
    );
}


chrome.action.onClicked.addListener((tab) => {
    if (!tab.url.includes("chrome://")) {
        chrome.scripting.executeScript({
            func: executeScript,
            target: {tabId: tab.id}
        });
    }
});
