/*!
 * index.js v1.0.1
 * (c) 2016 Jin Tian
 * Released under the GPL License.
 */
var xlsx = require("node-xlsx");

var ORDER_DETAIL = null;
//var TAX_RATE = 1.17 ;

var init_100 = function(){
  MSG.put("系统启动。");

  // 充当数据源的文件 的文件名 的关键字
  vm.src_files_flag.push("到货数据");
  vm.src_files_flag.push("自有调社会");
  vm.src_files_flag.push("终端销售明细表咸阳");
  vm.src_files_flag.push("终端销售明细表商洛");
  vm.src_files_flag.push("终端销售明细表安康");
  vm.src_files_flag.push("终端销售明细表宝鸡");
  vm.src_files_flag.push("终端销售明细表延安");
  vm.src_files_flag.push("终端销售明细表榆林");
  vm.src_files_flag.push("终端销售明细表汉中");
  vm.src_files_flag.push("终端销售明细表渭南");
  vm.src_files_flag.push("终端销售明细表西安");
  vm.src_files_flag.push("终端销售明细表铜川");
  
}

var check_env_110 = function(){
  
  // 程序运行所必须的库和配置文件
  var envlist = [];
  envlist.push("config.json");
  envlist.push("node_modules/node-xlsx/");
  envlist.push("node_modules/underscore/underscore-min.js");

  return true;
};

var select_file_120 = function(){
  
  if(fs.existsSync(vm.sales_filename)) {
    console.log('销售记录文件存在');
    
  } else {
    console.log('销售记录文件不存在');
    document.getElementById("file_src").click();
  }
  return true;
};

var check_src_130 = function(){
  var run_flag = true;

  // 设置base_dir
  var temp_path = document.getElementById("file_src").value;
  vm.base_dir = path.dirname(temp_path ) + "/" ;
  console.log("base_dir: " + vm.base_dir );

  // 程序运行所必须的数据源
  vm.src_files = find_src_file(vm.base_dir, vm.src_files_flag);
  
  console.log( vm.src_files);

  for( temp_name in vm.src_files){
    if( undefined === vm.src_files[temp_name]){
      ERR_MSG.put( "输入文件不全。缺少：" + temp_name );
      run_flag = false;
    }
  }
  return run_flag;;

}












