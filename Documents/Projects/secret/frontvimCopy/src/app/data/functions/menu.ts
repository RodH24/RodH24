export function getMenuOptionList(temp_permmission: Array<any>, structureSidebar: Array<any>, hasPeu: boolean): Array<any> {
  const menuOpt = getOptionList(structureSidebar, temp_permmission, hasPeu)
  return menuOpt;
}

function getOptionList(sidebar: any, temp_permmission: any, hasPeu: boolean): Array<any> {

  let optionList: Array<any> = [];
  for (let indexMenu in sidebar) {
    let sidebarSection = sidebar[indexMenu];
    let actualId = sidebarSection.codeId;
    let copy_sidebar_section = Object.assign({}, sidebarSection);
    // reset options array 
    sidebarSection.options = []

    if (temp_permmission[actualId] === true) {
      // validate if has peu enabled 

      if (hasPeu === true) {
        // push section 
        optionList.push(sidebarSection)
        // find for option list 
        for (let indexOptions in copy_sidebar_section.options) {
          let dataOption = copy_sidebar_section.options;
          let actual_option_id = dataOption[indexOptions].codeId;
          if (temp_permmission[actual_option_id] === true) {
            sidebarSection.options.push(dataOption[indexOptions])
          } else {
            continue
          }
        }
      } else {
        if (sidebarSection['id'] == 'peu') {
          continue
        } else {
          optionList.push(sidebarSection)
          // find for option list 
          for (let indexOptions in copy_sidebar_section.options) {
            let dataOption = copy_sidebar_section.options;
            let actual_option_id = dataOption[indexOptions].codeId;
            if (temp_permmission[actual_option_id] === true) {
              sidebarSection.options.push(dataOption[indexOptions])
            } else {
              continue
            }
          }
        }
      }
    } else {
      continue
    }
  }
  return optionList
}
