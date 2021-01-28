"use strict";

class RoundRoleChartConnector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetchById(roundId) {
    const roundRoleCharts = (
      await this.ctx.app.model.RoundRoleChart.findAll({
        where: {
          roundId,
        },
        attributes: [
          "id",
          "roundId",
          "roundRoleId",
          "normalCount",
          "specialCount",
          "totalCount",
          "createdAt",
        ],
        include: [
          {
            attributes: ["id", "roundId", "roleId"],
            as: "roundRole",
            model: this.ctx.app.model.RoundRole,
            include: [
              {
                attributes: ["id", "roleName"],
                as: "voteRole",
                model: this.ctx.app.model.VoteRole,
              },
            ],
          },
        ],
        order: [["createdAt", "ASC"]],
      })
    ).map((v) => v.toJSON());
    const roles = [];
    const times = [];
    roundRoleCharts.forEach((v) => {
      const index = roles.findIndex((k) => k.roundRoleId === v.roundRoleId);
      if (index === -1) {
        roles.push({
          roundRoleId: v.roundRoleId,
          name: v.roundRole.voteRole.roleName,
          normalCount: [v.normalCount],
          specialCount: [v.specialCount],
          totalCount: [v.totalCount],
        });
      } else {
        roles[index].normalCount.push(v.normalCount);
        roles[index].specialCount.push(v.specialCount);
        roles[index].totalCount.push(v.totalCount);
      }
      if (!times.includes(v.createdAt)) {
        times.push(v.createdAt);
      }
    });
    return { roles, times };
  }
}

module.exports = RoundRoleChartConnector;
