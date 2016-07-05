var address = {};

address.adminList=[];

address.addAdmin = function(string) {
    console.log("Added");
    address.adminList.push(string);
};

address.getAdmin = function() {
    console.log("Return");
    return address.adminList;
};

module.exports = address;

