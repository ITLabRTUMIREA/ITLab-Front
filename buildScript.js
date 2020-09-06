const args = process.argv.slice(2);
if (args.length % 2 !== 0) {
    console.error("arguments count must be odd"); //TODO check odd translation
    return;
}

const trimArg = (arg) => {
    if (arg.startsWith("-")) {
        return arg.slice(1);
    }
    return arg;
}

const defaultArgs = {
    authority: "http://127.0.0.1.xip.io:5501",
    clientId: "itlab_spa",
    redirectUri: "http://127.0.0.1.xip.io:5500/logincallback",
    responseType: "code",
    scope: "openid profile roles itlab.events itlab.projects itlab.salary itlab.reports",
    postLogOutRedirectUrl: "http://127.0.0.1.xip.io:5500",
    silentRedirectUrl: "http://127.0.0.1.xip.io:5500/silentcallback",
    vkGroupDIalogUrl: "https://vk.com/rtuitlab",
    filesBaseAddress: "http://127.0.0.1.xip.io:5500"

}

const overridedArgs = args
    .map((value, index, array) => index % 2 == 0 ? { key: trimArg(value), value: array[index + 1] } : null)
    .filter(a => a !== null)
    .reduce((total, current) => { total[current.key] = current.value; return total; }, defaultArgs);
console.log(JSON.stringify(overridedArgs));
