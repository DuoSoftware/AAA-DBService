/**
 * Created by Achintha on 6/25/15.
 */
module.exports = function(sequelize, DataTypes) {
    var radgroupreply = sequelize.define('radgroupreply', {
            id:{type : DataTypes.INTEGER, unique: true},
            groupname: DataTypes.STRING,
            attribute: DataTypes.STRING,
            op:DataTypes.STRING,
            value:DataTypes.STRING

        },
        {
            freezeTableName: true,
            tablename: 'radgroupreply'
        }
    );

    return radgroupreply;
};
