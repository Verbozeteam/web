
type URLType = {
    url: string,
    name: string,
    component: ?string,
};

var url: (string, string, ?string) => URLType = (url, name, component) => {return {url, name, component}};


var urls = [
    url('/company', 'Company'),
    url('/contact', 'Contact'),
    url('/modernizing-control', 'ModernizingControl', 'features/ModernizingControl'),
    url('/empowering-guests', 'EmpoweringGuests', 'features/EmpoweringGuests'),
    url('/reimagining-hotels', 'ReImaginingHotels', 'features/ReImaginingHotels'),
    url('/adopting-verboze', 'AdoptingVerboze', 'features/AdoptingVerboze'),
    url('/', 'Home'),
];

var URLMap: {[string]: string} = {};
var ComponentPaths: {[string]: string} = {};
for (var i = 0; i < urls.length; i++) {
  URLMap[urls[i].name] = urls[i].url;
  ComponentPaths[urls[i].name] = urls[i].component || urls[i].name;
}

module.exports = {
    URLMap,
    ComponentPaths,
};