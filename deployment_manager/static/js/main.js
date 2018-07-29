
function loadConfigs() {
    $.get('/deployment/deployment_config/', (c) => {
        console.log(c);
    });
}

$(document).ready(() => {
    loadConfigs();
});