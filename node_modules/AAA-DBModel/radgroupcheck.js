/**
 * Created by Achintha on 6/25/15.
 */
module.exports = function(sequelize, DataTypes) {
    var radgroupcheck = sequelize.define('radgroupcheck', {
            id:{type : DataTypes.INTEGER, unique: true},
            groupname: DataTypes.STRING,
            attribute: DataTypes.STRING,
            op:DataTypes.STRING,
            value:DataTypes.STRING

        },
        {
            freezeTableName: true,
            tablename: 'radgroupcheck'
        }
    );


    return radgroupcheck;
};
