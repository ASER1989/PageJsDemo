/**
 * Created by Lenovo on 2017/8/29.
 */
var store = {
    set: function (key, val) {
        localStorage.setItem(key, val)
    },
    get: function (key, def) {
        def = def || null;
        return key == null ? def : localStorage.getItem(key);
    },
    remove: function (key) {
        key != null && localStorage.removeItem(key);
    },
    removeAll:function () {
        localStorage.clear();
    }
}