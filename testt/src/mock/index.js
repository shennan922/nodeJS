import Mock from 'mockjs';
import userAPI from './user';

Mock.mock('/mock/users/3', 'get', userAPI.getUserById);