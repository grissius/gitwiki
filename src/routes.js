module.exports.generateBrowsingLink = ({ name, ref, path }) => `/repo/tree/${[name, ref, path].filter(p => p !== '').join('/')}`;
