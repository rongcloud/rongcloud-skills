/**
 * Web IMKit Hooks 实现
 * IMKit 在渲染会话列表、聊天界面时,通过这些钩子从业务层获取用户/群组资料。
 * ⚠️ 当前为演示实现(用 ID 生成占位名称),接入真实业务时应改为调用应用服务端接口。
 */
export const hooks = {
  // 批量获取用户信息
  async reqUserProfiles(userIds) {
    return userIds.map((userId) => ({
      userId,
      name: `用户 ${userId}`,
      portraitUri: '', // 头像为空时 SDK 使用默认头像
    }));
  },

  // 批量获取群组信息
  async reqGroupProfiles(groupIds) {
    return groupIds.map((groupId) => ({
      groupId,
      name: `群组 ${groupId}`,
      memberCount: 0,
      portraitUri: '',
    }));
  },

  // 获取群组成员列表
  // nickname 为空时,SDK 回落到 reqUserProfiles 返回的 name 字段;
  // 为减少内部重复请求,业务接入后建议直接返回真实群内昵称
  async reqGroupMembers(groupId) {
    return [];
  },

  // 批量获取系统会话信息(会话列表出现系统会话类型时调用)
  async reqSystemProfiles(systemIds) {
    return systemIds.map((systemId) => ({
      systemId,
      name: `系统消息 ${systemId}`,
      portraitUri: '',
    }));
  },
};
