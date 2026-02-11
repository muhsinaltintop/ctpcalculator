import * as U from "./units";

export const toIP = {
  temperature: U.C_to_F,
  waterFlow: U.m3h_to_gpm,
  airFlow: U.m3s_to_cfm,
  length: U.m_to_ft,
  pressure: U.Pa_to_inH2O,
  
};

export const toSI = {
  temperature: U.F_to_C,
  waterFlow: U.gpm_to_m3h,
  airFlow: U.cfm_to_m3s,
  length: U.ft_to_m,
  pressure: U.inH2O_to_Pa,
};
