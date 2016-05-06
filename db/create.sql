

CREATE TABLE `t_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `update_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `wllx` varchar(32) NOT NULL,  # 物料类型
  `wlbm` varchar(32) NOT NULL,  # 物料编码
  `jx`   varchar(32) NOT NULL,  # 机型
  `gsdz` varchar(32) NOT NULL,  # 归属地州
  `sjhm` varchar(32) NOT NULL,  # 手机号码
  `sjcm` varchar(32) NOT NULL,  # 手机串码
  `xssl` int         NOT NULL,  # 销售数量
  `lrrq` timestamp   NOT NULL,  # 录入日期
  `hsxsjehj` int     NOT NULL,  # 含税销售金额合计
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

