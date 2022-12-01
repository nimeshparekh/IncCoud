'use strict';

/**
 *  APIRESTERPNext class will exports public api.
 */

var request = require('request');
var requestPromise = require('request-promise');
var querystring = require('querystring');
var Promise = require('bluebird');
var fs = require('fs');

var APIRESTERPNext = function (options) {
    this.username = options.username;
    this.password = options.password;
    this.baseUrl = options.baseUrl;
    this.cookieJar = request.jar();
};

APIRESTERPNext.prototype.constructor = APIRESTERPNext;


/**
 *  Doing Login of a user and stores session cookie into cookieJar.
 *  @return {Promise} resolve response.
 */

APIRESTERPNext.prototype.login_id = function (id) {
    console.log(id)
    var _this = this;
    var formData = querystring.stringify({
        usr: id.username,
        pwd: id.password
    });
    var contentLength = formData.length;
    return requestPromise.post({
        url: _this.baseUrl + "/api/method/login",
        jar: _this.cookieJar,
        body: formData,
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).catch(function (error){
        let error1 = JSON.stringify("Error In Erp Lgin");
        console.log(error1);
        return error1
    })
}

APIRESTERPNext.prototype.login = function () {
    var _this = this;
    var formData = querystring.stringify({
        usr: _this.username,
        pwd: _this.password
    });
    var contentLength = formData.length;
    return requestPromise.post({
        url: _this.baseUrl + "/api/method/login",
        jar: _this.cookieJar,
        body: formData,
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
    })
    console.log(contentLength)
}



APIRESTERPNext.prototype.loginUser = function (req) {
    var _this = req;
    var __this = this
    var formData = querystring.stringify({
        usr: _this.username,
        pwd: _this.password
    });
    var contentLength = formData.length;
    return requestPromise.post({
        url: __this.baseUrl + "/api/method/login",
        jar: __this.cookieJar,
        body: formData,
        headers: {
            'Content-Length': contentLength,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

/**
 *  Metodo PAra Manejar Usuarios
 *  @return {Promise} resolve customer list.
 */


/**
 *  Will Call REST API to get customer list.
 *  @return {Promise} resolve customer list.
 */

APIRESTERPNext.prototype.getCustomersName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getItemName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Item Price?limit_page_length=500",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.checkProduct = function (name) {
    console.log("name :"+ name);
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Item?filters=%5B%5B%22Item%22%2C%22name%22%2C%22%3D%22%2C%22"+name+"%22%5D%5D&limit_start=0&limit_page_length=2",
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getLeadName = function (object) {
    var _this = this;
    console.log(object)
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead?limit_start="+object.limit_start+"&limit_page_length="+object.limit_page_length+"",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.getLeadStatus = function (object) {
    var _this = this;
    console.log(object)
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead?filters=%5B%5B%22Lead%22%2C%22status%22%2C%22%3D%22%2C%22Lead%22%5D%5D&limit_start="+object.limit_start+"&limit_page_length="+object.limit_page_length+"",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_not_LeadStatus = function (object) {
    var _this = this;
    console.log(object)
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead?filters=%5B%5B%22Lead%22%2C%22status%22%2C%22!%3D%22%2C%22Lead%22%5D%5D&limit_start="+object.limit_start+"&limit_page_length="+object.limit_page_length+"",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getDocTypeName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/DocType?limit_page_length=50",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getOpportunityName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getsales = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Taxes and Charges Template?filters=%5B%5B%22Sales+Taxes+and+Charges+Template%22%2C%22company%22%2C%22%3D%22%2C%22Garuda+Advertising+Pvt+Ltd%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getOpportunityName_not_Quotation = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity?filters=%5B%5B%22Opportunity%22%2C%22status%22%2C%22!%3D%22%2C%22Quotation%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getOpportunityName_Quotation = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity?filters=%5B%5B%22Opportunity%22%2C%22status%22%2C%22%3D%22%2C%22Quotation%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getQuotationName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Quotation/name=SAL-QTN-2021-00094",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_CustomerName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getOpportunity_typeName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity Type",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.getUserName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/User?filters=%5B%5B%22User%22%2C%22user_type%22%2C%22%3D%22%2C%22System+User%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_system_user_assign_lead = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/User?filters=%7B%22user_type%22%3A%22System+User%22%2C%22enabled%22%3A1%7D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_sales_stage = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Stage",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Currency = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Currency?limit_page_length=150",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_lead_source = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead Source",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Salutation = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Salutation",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Designation = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Designation",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Gender = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Gender",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Campaign = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Campaign?limit_page_length=150",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Country = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Country?limit_page_length=250",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_Company = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Company",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_market_segment = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Market Segment",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.get_industry_type = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Industry Type?limit_page_length=600",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_Salutation_list = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Salutation?limit_page_length=60",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_customer_list = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}
/**
 *  Will Call REST API to get Customer detail by name.
 *  @param {String} name name of the customer.
 */

APIRESTERPNext.prototype.getCustomerByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getItemByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Item Price/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getLeadByName = function (id,name) {
    var _this = this;
    return _this.login_id(id).then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getDocTypeByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/DocType/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getOpportunityByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getQuotationByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Quotation/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.get_CustomerByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.get_term = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Taxes and Charges Template?filters=%5B%5B%22Sales+Taxes+and+Charges+Template%22%2C%22company%22%2C%22%3D%22%2C%22Garuda+Advertising+Pvt+Ltd%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.Tax_Category = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Tax Category",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.get_term_name = function (name) {
    var _this = this;
    console.log(name)
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Taxes and Charges Template/"+name,
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.getOpportunity_TypeByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Opportunity Type/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}

APIRESTERPNext.prototype.getUserByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/User/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    });
}


APIRESTERPNext.prototype.getLeadSearch = function (object) {
    var _this = this;
    console.log(object)
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead?filters=%5B%5B%22Lead%22%2C%22title%22%2C%22like%22%2C%22%25"+object+"%25%22%5D%5D",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


/**
 *  Will Call REST API to create customer.
 *  for parameters follow https://frappe.github.io/APIRESTERPNext/current/models/selling/customer
 *  @param  {Object} customerData customer data object.
 *  @return {Promise} resolve with customer data.
 */

APIRESTERPNext.prototype.createCustomer = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

APIRESTERPNext.prototype.createOpportunity = function (id,object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Opportunity",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = JSON.stringify("Error");
            console.log(error1);
            return error1
        })
    })
}


APIRESTERPNext.prototype.post_Lead = function (id,object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Lead",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = JSON.stringify("Error");
            console.log(error1);
            return error1
        })
    })
}

/**
 * Get Customer info array
 * @return {Promise} resolve with array of clients info
 */

APIRESTERPNext.prototype.getCustomers = function () {
    var _this = this;
    return _this.getCustomersName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getCustomerByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getItem = function () {
    var _this = this;
    return _this.getItemName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getItemByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getLead = function (object) {
    var _this = this; 
    return _this.getLeadName(object).then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getLeadByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.get_lead_status_lead = function (object) {
    var _this = this; 
    return _this.getLeadStatus(object).then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getLeadByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.get_lead_status_not_lead = function (object) {
    var _this = this; 
    return _this.get_not_LeadStatus(object).then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getLeadByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getLeadSearchfun = function (object) {
    var _this = this; 
    return _this.getLeadSearch(object).then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getLeadByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getLeadSearchfun = function (object) {
    var _this = this; 
    return _this.getLeadSearch(object).then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getLeadByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.updateLeadByName = function (name, object) {
    var _this = this;
    console.log("Start")
    // var formData = querystring.stringify({
    //     data: JSON.stringify(object)
    // });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/assign_to?",
            jar: _this.cookieJar,
            // body: "",
            headers: {
                // 'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}


APIRESTERPNext.prototype.updateLeadAll = function (id,name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Lead/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = JSON.stringify("Error");
            console.log(error1);
            return error1
        })
    });
}

APIRESTERPNext.prototype.update_Opportunity = function (id,name, object) {
    var _this = this;
    console.log(object)
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Opportunity/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

APIRESTERPNext.prototype.updateLeadByName_assign = function (name, object) {
    var _this = this;
    console.log(object)
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Lead/" + "CRM-LEAD-2021-01056",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

APIRESTERPNext.prototype.getDocType = function () {
    var _this = this; 
    return _this.getDocTypeName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getDocTypeByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getOpportunity = function () {
    var _this = this; 
    return _this.getOpportunityName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getOpportunityByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getOpportunity_status_not_Quotation = function () {
    var _this = this; 
    return _this.getOpportunityName_not_Quotation().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getOpportunityByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getOpportunity_status_Quotation = function () {
    var _this = this; 
    return _this.getOpportunityName_Quotation().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getOpportunityByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getQuotation_status_order = function () {
    var _this = this; 
    return _this.getQuotationName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getQuotationByName(customer.name);
        });
    })
}


APIRESTERPNext.prototype.get_Customer_list_api = function () {
    var _this = this; 
    return _this.get_CustomerName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.get_CustomerByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.sales_taxes_api = function () {
    var _this = this; 
    return _this.get_term().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.get_term_name(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getUserList = function () {
    var _this = this; 
    return _this.getUserName().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getUserByName(customer.name);
        });
    })
}

APIRESTERPNext.prototype.getUserList_status_lead = function () {
    var _this = this; 
    return _this.get_system_user_assign_lead().then(function (customers) {
        return Promise.map(customers, function (customer) {
            return _this.getUserByName(customer.name);
        });
    })
}


/**
 *  Update Customer by name.
 *  @param  {String} name name of the customer.
 *  @param  {Object} object data to be update.
 *  @return {Promise} resolve with customer data.
 */

APIRESTERPNext.prototype.updateCustomerByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Customer/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}




/**
 * Create Customer Group.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/setup/customer_group
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

APIRESTERPNext.prototype.createCustomerGroup = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer Group",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

APIRESTERPNext.prototype.create_Customer = function (id,object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Customer",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 * Update Customer Group by name.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/setup/customer_group
 * @param {String} name customer group name.
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

APIRESTERPNext.prototype.updateCustomerGroupByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Customer Group/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customerGroup) {
            customerGroup = JSON.parse(customerGroup);
            return customerGroup.data;
        })
    })
}


/**
 * Get Customer Group's name.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/setup/customer_group
 * @param {Object} object customer group data.
 * @return {Promise} resolve with customer group data. 
 */

APIRESTERPNext.prototype.getCustomerGroupsName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer Group",
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 * Get Customer Group's info by name.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/setup/customer_group
 * @param {String} name customer group's name.
 * @return {Promise} resolve with customer group data.
 */

APIRESTERPNext.prototype.getCustomerGroupByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Customer Group/" + name,
            jar: _this.cookieJar,
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

/**
 *  Get Customer Group's info array.
 *  @return {Promise} resolve customer group data array.
 */

APIRESTERPNext.prototype.getCustomerGroups = function () {
    var _this = this;
    return _this.getCustomerGroupsName().then(function (customersGroups) {
        return Promise.map(customersGroups, function (group) {
            return _this.getCustomerGroupByName(group.name);
        });
    })
}


/**
 *  Get Sales Order's name array.
 *  @return {Promise} resolve customer group data array.
 */

APIRESTERPNext.prototype.getSalesOrdersName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Order",
            jar: _this.cookieJar,
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 *  Get Sales Order's name array.
 *  @param {String} name name of the sales order
 *  @return {Promise} resolve customer group data array.
 */

APIRESTERPNext.prototype.getSalesOrderByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Order/" + name,
            jar: _this.cookieJar,
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 * Get Sales Order info array.
 * @return {Promise} resolve Sales Orders array list.
 */

APIRESTERPNext.prototype.getSalesOrder = function () {
    var _this = this;
    return _this.getSalesOrdersName().then(function (salesOrders) {
        return Promise.map(salesOrders, function (saleOrder) {
            return _this.getSalesOrderByName(saleOrder.name);
        });
    })
}


/**
 * Create Sales Order.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/selling/sales_order
 * @param {Object} object Sales Order.
 * @return {Promise} resolve Created Sales Order.
 */

APIRESTERPNext.prototype.createSalesOrder = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Order",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}


/**
 * Update Sales Order by name.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/selling/sales_order
 * @param {String} name name of the sales order.
 * @param {Object} object data of sales order.
 * @return {Promise} resolve Created Sales Order.
 */

APIRESTERPNext.prototype.updateSalesOrderByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Sales Order/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (salesOrder) {
            salesOrder = JSON.parse(salesOrder);
            return salesOrder.data;
        })
    })
}

/**
 * Create an Item.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/accounts/sales_invoice_item.
 * @param {Object} object item object.
 * @return {Promise} resolve Created item.
 */

APIRESTERPNext.prototype.createAnItem = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Item",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}

/**
 * 
 * @param {*} name 
 * @param {*} object 
 * @returns  create item price
 */

 APIRESTERPNext.prototype.createItemPrice = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Item Price",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}

/**
 * Update an Item.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/selling/sales_order
 * @param {String} name name of the item.
 * @param {Object} object data of item.
 * @return {Promise} resolve updated item
 */


APIRESTERPNext.prototype.updateItemByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Item/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}

APIRESTERPNext.prototype.updateItemPriceByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Item Price/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (item) {
            item = JSON.parse(item);
            return item.data;
        })
    })
}


/**
 * Create a Supplier.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/buying/supplier.
 * @param {Object} object Supplier object.
 * @return {Promise} resolve Created Supplier.
 */

APIRESTERPNext.prototype.createSupplier = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Supplier",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (Supplier) {
            Supplier = JSON.parse(Supplier);
            return Supplier.data;
        })
    })
}

/**
 * Update Supplier.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/buying/supplier.
 * @param {String} name name of the Supplier.
 * @param {Object} object data of Supplier.
 * @return {Promise} resolve updated Supplier
 */

APIRESTERPNext.prototype.updateSupplierByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Supplier/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (Supplier) {
            Supplier = JSON.parse(Supplier);
            return Supplier.data;
        })
    })
}

/**
 * Create a Purchase Invoice.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/accounts/purchase_invoice.
 * @param {Object} object Purchase Invoice  object.
 * @return {Promise} resolve Created Purchase Invoice .
 */

APIRESTERPNext.prototype.createPurchaseInvoice = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Purchase Invoice",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseInvoice) {
            PurchaseInvoice = JSON.parse(PurchaseInvoice);
            return PurchaseInvoice.data;
        })
    })
}

/**
 * Update Purchase Invoice.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/accounts/purchase_invoice.
 * @param {String} name name of the Purchase Invoice.
 * @param {Object} object data of Purchase Invoice.
 * @return {Promise} resolve updated Purchase Invoice.
 */

APIRESTERPNext.prototype.updatePurchaseInvoiceByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Purchase Invoice/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseInvoice) {
            PurchaseInvoice = JSON.parse(PurchaseInvoice);
            return PurchaseInvoice.data;
        })
    })
}

/**
 * Create a Sales Invoice.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/accounts/sales_invoice
 * @param {Object} object Sales Invoice  object.
 * @return {Promise} resolve Created Sales Invoice.
 */

APIRESTERPNext.prototype.createSalesInvoice = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Invoice",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Update Sales Invoice.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/accounts/sales_invoice
 * @param {String} name name of the Sales Invoice.
 * @param {Object} object data of Sales Invoice.
 * @return {Promise} resolve updated Sales Invoice.
 */

APIRESTERPNext.prototype.updateSalesInvoiceByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Sales Invoice/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Create a Purchase Order.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/buying/purchase_order
 * @param {Object} object Purchase Order object.
 * @return {Promise} resolve Created Purchase Order.
 */

APIRESTERPNext.prototype.createPurchaseOrder = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Purchase Order",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (SalesInvoice) {
            SalesInvoice = JSON.parse(SalesInvoice);
            return SalesInvoice.data;
        })
    })
}

/**
 * Update Purchase Order.
 * For param follow https://frappe.github.io/APIRESTERPNext/current/models/buying/purchase_order
 * @param {String} name name of the Purchase Order.
 * @param {Object} object data of Purchase Order.
 * @return {Promise} resolve updated Purchase Order.
 */

APIRESTERPNext.prototype.updatePurchaseOrderByName = function (name, object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.put({
            url: _this.baseUrl + "/api/resource/Purchase Order/" + name,
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (PurchaseOrder) {
            PurchaseOrder = JSON.parse(PurchaseOrder);
            return PurchaseOrder.data;
        })
    })
}



/**
 *  Will Call REST API to get Purchase Order list.
 *  @return {Promise} resolve Purchase Order list.
 */

APIRESTERPNext.prototype.getPurchaseOrdersName = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Purchase Order",
            jar: _this.cookieJar,
        }).then(function (purchaseOrders) {
            purchaseOrders = JSON.parse(purchaseOrders);
            return purchaseOrders.data;
        });
    });
}

/**
 *  Will Call REST API to get Purchase Order detail by name.
 *  @param {String} name name of the Purchase Order.
 */

APIRESTERPNext.prototype.getPurchaseOrderByName = function (name) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Purchase Order/" + name,
            jar: _this.cookieJar,
        }).then(function (purchaseOrders) {
            purchaseOrders = JSON.parse(purchaseOrders);
            return purchaseOrders.data;
        })
    });
}


/**
 * Get Purchase Order info array
 * @return {Promise} resolve with array of Purchase Order info
 */

APIRESTERPNext.prototype.getPurchaseOrders = function () {
    var _this = this;
    return _this.getPurchaseOrdersName().then(function (PurchaseOrders) {
        return Promise.map(PurchaseOrders, function (PurchaseOrder) {
            return _this.getPurchaseOrderByName(PurchaseOrder.name);
        });
    })
}

/**
 * Administrando 
 * @return {Promise} resolve with array of Purchase Order info
 */
// Traer usuarios
APIRESTERPNext.prototype.getUsers = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/User",
            jar: _this.cookieJar
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}
// crear usuario
/* Tener en cuenta el Objeto {
    "email": "maleddddjapeka26@gmail.com",
    "first_name": "Mariadd Alejandra Peña de teheran",
    "last_name": "tehewran",
    "new_password": "123456"
}*/
APIRESTERPNext.prototype.createUSers = function (obj) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(obj)
    });
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/User",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}


APIRESTERPNext.prototype.sainterpnext = function (recurso, metodo, obj) {
    var _this = this;
    console.log(recurso, metodo, obj)
    if (metodo != 'GET') {

        var formData = querystring.stringify({
            data: JSON.stringify(obj)
        });
        var contentLength = formData.length;


    }
    return _this.login().then(function (res) {
        switch (metodo) {
            case 'POST':
                return requestPromise.post({
                    url: _this.baseUrl + recurso,
                    jar: _this.cookieJar,
                    body: formData,
                    headers: {
                        'Content-Length': contentLength,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (customers) {
                    customers = JSON.parse(customers);
                    return customers.data;
                });
                break;
            case 'GET':
                return requestPromise.get({
                    url: _this.baseUrl + recurso,
                    jar: _this.cookieJar
                }).then(function (customers) {
                    customers = JSON.parse(customers);
                    return customers.data;
                });
                break;
            case 'PUT':
                return requestPromise.put({
                    url: _this.baseUrl + recurso,
                    jar: _this.cookieJar,
                    body: formData,
                    headers: {
                        'Content-Length': contentLength,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (customers) {
                    customers = JSON.parse(customers);
                    return customers.data;
                });
                break;
            case 'DELETE':
                return requestPromise.delete({
                    url: _this.baseUrl + recurso,
                    jar: _this.cookieJar,
                    body: formData,
                    headers: {
                        'Content-Length': contentLength,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (customers) {
                    customers = JSON.parse(customers);
                    return customers.data;
                });

                break;
        }
    });
}

APIRESTERPNext.prototype.get_issue = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Issue",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_projects = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Project",
            jar: _this.cookieJar,
        }).then(function (projects) {
            projects = JSON.parse(projects);
            return projects.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_contacts = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Contact",
            jar: _this.cookieJar,
        }).then(function (projects) {
            projects = JSON.parse(projects);
            return projects.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_servicelevelagreement = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Service Level Agreement",
            jar: _this.cookieJar,
        }).then(function (projects) {
            projects = JSON.parse(projects);
            return projects.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_emailaccount = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Email Account",
            jar: _this.cookieJar,
        }).then(function (projects) {
            projects = JSON.parse(projects);
            return projects.data;
        });
    });
 }

 APIRESTERPNext.prototype.createIssue = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Issue",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

APIRESTERPNext.prototype.get_issuetype = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Issue Type",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_pricelist = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Price List?filters=%5B%5B%22Price+List%22%2C%22selling%22%2C%22%3D%22%2C%221%22%5D%5D&limit_start=0&limit_page_length=25",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_warehouse = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Warehouse?filters=%5B%5B%22Warehouse%22%2C%22is_group%22%2C%22%3D%22%2C0%2Cfalse%5D%2C%5B%22Warehouse%22%2C%22company%22%2C%22%3D%22%2C%22Garuda+Advertising+Pvt+Ltd%22%5D%5D&limit_start=0&limit_page_length=25",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_sellingshippingrule = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Shipping Rule?filters=%5B%5B%22Shipping+Rule%22%2C%22shipping_rule_type%22%2C%22%3D%22%2C%22Selling%22%5D%5D&limit_start=0&limit_page_length=25",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_salestaxesandchargestemplate = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Taxes and Charges Template?filters=%5B%5B%22Sales+Taxes+and+Charges+Template%22%2C%22company%22%2C%22%3D%22%2C%22Garuda+Advertising+Pvt+Ltd%22%5D%5D&limit_start=0&limit_page_length=25",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_couponcode = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Coupon Code",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_paymentermstemplate = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Payment Terms Template",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_termsconditions = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Terms and Conditions?filters=%5B%5B%22Terms+and+Conditions%22%2C%22selling%22%2C%22%3D%22%2C%221%22%5D%5D&limit_start=0&limit_page_length=25",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_purchaseorder = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Purchase Order",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_leadsource = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Lead Source",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }
 APIRESTERPNext.prototype.get_letterhead = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Letter Head",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_printheading = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Print Heading",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.get_salespartner = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Sales Partner",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 

 APIRESTERPNext.prototype.get_autorepeat = function () {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + "/api/resource/Auto Repeat",
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
 }

 APIRESTERPNext.prototype.checkUserExists = function (type,value) {
    var _this = this;
    return _this.login().then(function (res) {
        return requestPromise.get({
            url: _this.baseUrl + '/api/resource/User?filters=[["User","enabled","=",1],["User","'+type+'","=","'+value+'"]]',
            jar: _this.cookieJar,
        }).then(function (customers) {
            customers = JSON.parse(customers);
            return customers.data;
        });
    });
}

APIRESTERPNext.prototype.saveLeadNote = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Note",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}


APIRESTERPNext.prototype.get_pdf = function () {
    var _this = this;
    console.log("start")
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/printview?doctype=Quotation&name=SAL-QTN-2021-00068&trigger_print=1&format=Standard&no_letterhead=0&_lang=en",
            jar: _this.cookieJar
        }).then(function (customers) {
            // fs.writeFile('./uploads/quotation.pdf', customers, 'binary', function(err) {})
            // customers = JSON.stringify(customers);
            // console.log(customers)
            return customers;
        });
    });
 }

APIRESTERPNext.prototype.post_quotation = function (id,object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Quotation",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = JSON.stringify("Error");
            console.log(error1);
            return error1
        })
    })
}


APIRESTERPNext.prototype.post_Sales_order = function (id,object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login_id(id).then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Sales Order",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = JSON.stringify("Error");
            console.log(error1);
            return error1
        })
    })
}

APIRESTERPNext.prototype.saveLeadComment = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Comment",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        }).catch(function (error){
            let error1 = error;
            return error
        })
    })
}



APIRESTERPNext.prototype.createSubscription = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Subscription",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}



APIRESTERPNext.prototype.createSubscription_plan = function (object) {
    var _this = this;
    var formData = querystring.stringify({
        data: JSON.stringify(object)
    });
    console.log(object)
    var contentLength = formData.length;
    return _this.login().then(function (res) {
        return requestPromise.post({
            url: _this.baseUrl + "/api/resource/Subscription Plan",
            jar: _this.cookieJar,
            body: formData,
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (customer) {
            customer = JSON.parse(customer);
            return customer.data;
        })
    })
}

module.exports = APIRESTERPNext;