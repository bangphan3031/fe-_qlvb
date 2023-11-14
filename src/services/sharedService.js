import { sendRequest } from 'utils/apiUtils';
import { axiosClient } from './axiosClient';
import { store } from '../store/index';
import { setLoading } from 'store/actions';

export async function getLoaiDonVi() {
  try {
    const response = await sendRequest(`Shared/GetLoaiDonVi`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

export async function getAllTruong(username) {
  try {
    const response = await sendRequest(`Shared/GetAllTruong?username=${username}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function getAllLoaiDonVi() {
  try {
    const response = await sendRequest(`Shared/GetLoaiDonVi`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating LDV:', error);
    throw error;
  }
}
export async function getAllDonViCha() {
  try {
    const response = await sendRequest(`Shared/GetAllDonViCha`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DVC:', error);
    throw error;
  }
}
export async function GetCauHinhByIdDonVi(username) {
  try {
    store.dispatch(setLoading(true));
    const response = await axiosClient(`Shared/GetCauHinhByUsername?username=${username}`, 'GET', null);
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating User:', error);
    throw error;
  }
}

export async function getAllDonViByUsername(username) {
  try {
    const response = await sendRequest(`Shared/GetAllDonViByUsername?username=${username}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DVC:', error);
    throw error;
  }
}

export async function getAllHeDaoTao() {
  try {
    const response = await sendRequest(`Shared/GetAllHeDaoTao`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DVC:', error);
    throw error;
  }
}

export async function getAllHinhThucDaoTao() {
  try {
    const response = await sendRequest(`Shared/GetAllHinhThucDaoTao`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DVC:', error);
    throw error;
  }
}

export async function getAllDanhmucTN(username) {
  try {
    const response = await sendRequest(`Shared/GetAllDanhMucTotNghiep?username=${username}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating Donvi:', error);
    throw error;
  }
}

export async function getByCCCD(cccd) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Shared/GetByCccd?cccd=${cccd}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating hocsinh:', error);
    throw error;
  }
}

export async function getAllNamThi() {
  try {
    const response = await sendRequest(`Shared/GetAllNamThi`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating NamThi:', error);
    throw error;
  }
}

export async function getKhoaThiByNamThi(idnam) {
  try {
    const response = await sendRequest(`Shared/GetAllKhoaThiByNamThi?idNamThi=${idnam}`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating NamThi:', error);
    throw error;
  }
}

export async function getAllDanToc() {
  try {
    const response = await sendRequest(`Shared/GetAllDanToc`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DanToc:', error);
    throw error;
  }
}

export async function GetPhoiGocDangSuDung(username) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Shared/GetPhoiGocDangSuDung?username=${username}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating hocsinh:', error);
    throw error;
  }
}
export async function getByIdNamThi(idnam, maHtdt, nguoiThucHien) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Shared/GetByIdNamThi/${idnam}/${maHtdt}?nguoiThucHien=${nguoiThucHien}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}

export async function getAllFunction() {
  try {
    const response = await sendRequest(`Shared/GetAllFunction`, 'GET');
    return response;
  } catch (error) {
    console.error('Error creating DanToc:', error);
    throw error;
  }
}

export async function getActionsByFunctionId(id) {
  try {
    store.dispatch(setLoading(true));
    const response = await sendRequest(`Shared/GetActionsByFunctionId/${id}`, 'GET');
    store.dispatch(setLoading(false));
    return response;
  } catch (error) {
    console.error('Error creating DanhmucTN:', error);
    throw error;
  }
}
