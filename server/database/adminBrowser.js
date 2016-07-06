var address = {};

address.adminList=[];

address.addAdmin = function(string) {
    address.adminList.push(string);
};

address.getAdmin = function() {
    return address.adminList;
};

module.exports = address;

