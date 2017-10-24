const fs = require('fs');
const ipToInt = require('ip-to-int');
const segePath = `${__dirname}/../conf/IPlibIAC_segs_henan.csv`;
const areaPath = `${__dirname}/../conf/IPlibIAC_area_henan.csv`;


/**
 * 处理ip2Int异常
 * @param ip
 * @returns {*}
 */
const ip2Int = function (ip) {
    try {
        return ipToInt(ip).toInt();
    } catch (err) {
        return 0;
    }
};


/**
 * 读取seges文件并生成集合
 * @type {Array}
 */
const sortedIPlist = [];
const mapSeges = new Map();
const seges = fs.readFileSync(segePath).toString().split('\n');
seges.forEach((line) => {
    const fields = line.split('\t');
    if (fields.length===3) {
        sortedIPlist.push(ip2Int(fields[0]));
        sortedIPlist.push(ip2Int(fields[1]));
        mapSeges.set(ip2Int(fields[0]), fields[2]);
    }
});


/**
 * 读取area文件并生成集合
 * @type {Array}
 */
const citys = [];
const mapAreas = new Map();
const areas = fs.readFileSync(areaPath).toString().split('\n');
areas.forEach((line) => {
    const fields = line.split('\t');
    if (fields.length===3) {
        citys.push({alias: fields[0], name: fields[1]});
        mapAreas.set(fields[2], fields[1]);
    }
});


/**
 * 二分查找ip在有序list中index
 * @param ip
 * @returns {number}
 */
const searchIPIndex = function (ip) {
    const ipInt = ip2Int(ip);
    let low = 0;
    let high = sortedIPlist.length - 1;

    while (low < high) {
        let mid = (low + high) >>> 1;
        if (ipInt < sortedIPlist[mid]) {
            if (ipInt > sortedIPlist[mid - 1]) {
                return mid - 1;
            }
            high = mid - 1;
        } else if (ipInt > sortedIPlist[mid]) {
            if (ipInt < sortedIPlist[mid - 1]) {
                return mid;
            }
            low = mid + 1;
        } else {
            return mid;
        }
    }
    return 0;
};


/**
 * ip to ipcode to city
 * @param ip
 * @returns {V}
 */
const ip2City = function (ip) {
    const ipIndex = searchIPIndex(ip);
    const ipCode = mapSeges.get(sortedIPlist[ipIndex]);
    return city = mapAreas.get(ipCode);
};


module.exports.ip2City = ip2City;

module.exports.citys = citys;
