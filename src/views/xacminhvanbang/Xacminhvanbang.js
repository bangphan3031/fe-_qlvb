import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconChecks, IconEdit, IconSearch, IconTrash } from '@tabler/icons';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { infoHocSinhSelector, openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import {
  selectedDanhmuc,
  selectedDonvitruong,
  selectedHocsinh,
  setInfoHocSinh,
  setLoading,
  setOpenPopup,
  setReloadData,
  showAlert
} from 'store/actions';
import { useTranslation } from 'react-i18next';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import useLocalText from 'utils/localText';
import i18n from 'i18n';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import MainCard from 'components/cards/MainCard';
//import { getAllDonvi } from 'services/donvitruongService';
import BackToTop from 'components/scroll/BackToTop';
import Popup from 'components/controls/popup';
import { getAllNamthi } from 'services/namthiService';
import Detail from './Detail';
import { getAllHinhthucdaotao } from 'services/hinhthucdaotaoService';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import ButtonSuccess from 'components/buttoncolor/ButtonSuccess';
import Xacminhtungnguoi from './Xacminhtungnguoi';
import LichSuXacMinh from './LichSuXacMinh';
import Xacminhnhieunguoi from './Xacminhnhieunguoi';
// import { getHocSinhXacMinhVanBang } from 'services/xacminhvanbangService';
import { getHocSinhXacMinhVanBang } from 'services/tracuuvanbangService';

import { getAllTruong, getByIdNamThi } from 'services/sharedService';
import ChinhSuaVBCC from 'views/chinhsuavbcc/ChinhSuaVBCC';
import Thuhoihuybo from 'views/thuhoihuybo/Thuhoihuybo';
import LichSuThuHoi from 'views/thuhoihuybo/LichSuThuHoi';
import CapLaiVBCC from 'views/caplaivbcc/CapLaiVBCC';
import DeleteDanhSachXacMinh from './DeleteDanhSachXacMinh';
import ActionButtons from 'components/button/ActionButtons';

export default function Xacminhvanbang() {
  const isXs = useMediaQuery('(max-width:800px)');
  const openPopup = useSelector(openPopupSelector);
  const language = i18n.language;
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const [dMTN, setDMTN] = useState([]);
  const [donvis, setDonvis] = useState([]);
  const [namHoc, setNamHoc] = useState([]);
  const [htdt, setHTDT] = useState([]);
  const [trangThai, setTrangThai] = useState('');
  const [search, setSearch] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstLoad1, setFirstLoad1] = useState(true);
  const reloadData = useSelector(reloadDataSelector);
  const [selectDonvi, setSelectDonvi] = useState('');
  const [selectDanhmuc, setSelectDanhmuc] = useState('');
  const [selectNamHoc, setSelectNamHoc] = useState('');
  const [selectHTDT, setSelectHTDT] = useState('');
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const navigate = useNavigate();
  const [loadData, setLoadData] = useState(false);
  const infoHocSinh = useSelector(infoHocSinhSelector);
  const user = useSelector(userLoginSelector);
  let existingHocSinhs = [];
  if (user && user.username) {
    existingHocSinhs = JSON.parse(localStorage.getItem(user.username)) || [];
  } else {
    existingHocSinhs = [];
  }
  const [firstLoad3, setFirstLoad3] = useState(true);
  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 0,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    hoTen: '',
    noiSinh: '',
    DMTN: '',
    danToc: '',
    donVi: '',
    namHoc: '',
    trangThai: ''
  });

  const handleSearch = () => {
    setSearch(!search);
    const donviSelect = pageState.donVi;
    const selectedDonviInfo = donvis.find((donvi) => donvi.id === donviSelect);
    const danhmucSelect = pageState.DMTN;
    const selectedDanhmucInfo = dMTN.find((dmtn) => dmtn.id === danhmucSelect);
    setSelectDonvi(pageState.donVi);
    setSelectDanhmuc(pageState.DMTN);
    dispatch(selectedDanhmuc(selectedDanhmucInfo));
    dispatch(selectedDonvitruong(selectedDonviInfo));
    setTrangThai(pageState.trangThai);
  };

  const handleDetail = (hocsinh) => {
    setTitle(t('hocsinh.title.info'));
    setForm('detail');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleXemLichSu = (hocsinh) => {
    setTitle(t('xacminhvanbang.title.xemlichsu'));
    setForm('xemlichsu');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };
  const handleThuHoiHuyBo = (hocsinh) => {
    setTitle(t('Thu hồi hủy bỏ văn bằng chứng chỉ'));
    setForm('thuhoi');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleXacMinh = (hocsinh) => {
    setTitle(t('xacminhvanbang.title'));
    setForm('xacminh');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };
  const handleXemLichSuHuyBo = (hocsinh) => {
    setTitle(t('Xem lịch sử thu hồi hủy bỏ'));
    setForm('xemlichsuhuybo');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };
  window.addEventListener('beforeunload', () => {
    localStorage.removeItem(user.username);
  });
  const handleThemVaoDSXM = (hocsinh) => {
    const existingHocSinhs = JSON.parse(localStorage.getItem(user.username)) || [];
    const isHocSinhTonTai = existingHocSinhs.some((hs) => hs.id === hocsinh.id);
    if (isHocSinhTonTai) {
      dispatch(showAlert(new Date().getTime().toString(), 'error', 'Học sinh đã tồn tại trong danh sách'));
    } else {
      existingHocSinhs.push(hocsinh);
      localStorage.setItem(user.username, JSON.stringify(existingHocSinhs));
      dispatch(showAlert(new Date().getTime().toString(), 'success', 'Thêm học sinh vào danh sách thành công'));
    }
  };

  const handleXacMinhNhieuNguoi = (hocsinh) => {
    setTitle(t('xacminhvanbang.title'));
    setForm('xacminhnhieunguoi');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleChinhSuaVBCC = (hocsinh) => {
    setTitle(t('Chỉnh sửa văn bằng chứng chỉ'));
    setForm('chinhsuavbcc');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleCapLaiVBCC = (hocsinh) => {
    setTitle(t('Cấp lại văn bằng'));
    setForm('caplaivbcc');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };
  const handleDeleteDanhSachXacMinh = () => {
    setTitle(t('Xóa danh sách xác minh'));
    setForm('deleteall');
    dispatch(setOpenPopup(true));
  };

  const xacminhvb = [
    {
      type: 'xemlichsuxacminh',
      handleClick: handleXemLichSu
    },
    {
      type: 'xacminh',
      handleClick: handleXacMinh
    },
    {
      type: 'addlist',
      handleClick: handleThemVaoDSXM
    }
  ];

  //button chỉnh sửa, cấp lại, thu hồi hủy bỏ văn bằng
  const chinhsuavb = [
    {
      type: 'chinhsuavbcc',
      handleClick: handleChinhSuaVBCC
    },
    {
      type: 'caplaivbcc',
      handleClick: handleCapLaiVBCC
    },
    {
      type: 'thuhoi',
      handleClick: handleThuHoiHuyBo
    }
  ];

  const xacminhvb1 = [
    {
      type: 'xemlichsuxacminh',
      handleClick: handleXemLichSu
    },
    {
      type: 'xemlichsuhuybo',
      handleClick: handleXemLichSuHuyBo
    }
  ];

  const initialColumns = [
    {
      field: 'idx',
      headerName: t('serial'),
      width: 50,
      sortable: false,
      filterable: false,
      cellClassName: 'top-aligned-cell'
    },
    {
      field: 'hoTen',
      headerName: t('hocsinh.field.fullname'),
      flex: 2,
      minWidth: 180,
      renderCell: (params) => (
        <>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="body1">{params.value}</Typography>
            </Grid>
          </Grid>
        </>
      )
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.5,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1,
      minWidth: 80
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 100
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 2,
      minWidth: 100
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 150,
      sortable: false,
      filterable: false,
      align: 'right',
      renderCell: (params) => (
        <>
          {params.row.trangThai !== -1 ? (
            <Grid container spacing={1}>
              <Grid item>
                <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
              </Grid>
              <Grid item>
                <CombinedActionButtons
                  params={params.row}
                  buttonConfigurations={xacminhvb}
                  icon={IconChecks}
                  title={t('button.title.xacminh')}
                />
              </Grid>
              <Grid item>
                <CombinedActionButtons
                  params={params.row}
                  buttonConfigurations={chinhsuavb}
                  icon={IconEdit}
                  title={t('button.title.chinhsua.huybo')}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1}>
              <Grid item>
                <ActionButtons type="detail" handleGetbyId={handleDetail} params={params.row} />
              </Grid>
              <Grid item>
                <CombinedActionButtons
                  params={params.row}
                  buttonConfigurations={xacminhvb1}
                  icon={IconChecks}
                  title={t('button.title.chinhsua.huybo')}
                />
              </Grid>
            </Grid>
          )}
        </>
      )
    }
  ];

  if (trangThai === '4') {
    initialColumns.splice(7, 0, {
      field: 'soLanIn',
      headerName: t('Số lần in'),
      flex: 1
    });
  }

  const columns = [...initialColumns];

  useEffect(() => {
    const fetchDataDL = async () => {
      const namhoc = await getAllNamthi();
      setNamHoc(namhoc.data);
    };
    fetchDataDL();
  }, []);
  useEffect(() => {
    const fetchDataDL = async () => {
      setTimeout(
        async () => {
          try {
            setLoading(true);
            const htdt = await getAllHinhthucdaotao();
            setHTDT(htdt.data);
            const donvi = await getAllTruong(user ? user.username : '');
            if (donvi.data && donvi.data.length > 0) {
              setDonvis(donvi.data);
            } else {
              setDonvis([]);
            }
            setFirstLoad3(false);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        },
        firstLoad3 ? 2500 : 0
      );
    };
    fetchDataDL();
  }, [user]);

  useEffect(() => {
    if (namHoc.length > 0 && htdt.length > 0 && donvis.length > 0 && infoHocSinh) {
      const fetchData = async () => {
        try {
          const selectDonvi = donvis.find((item) => item.ten === infoHocSinh.tenTruong);
          dispatch(selectedDonvitruong(selectDonvi));
          setPageState((old) => ({
            ...old,
            trangThai: infoHocSinh.trangThai,
            donVi: selectDonvi.id,
            hoTen: infoHocSinh.hoTen,
            cccd: infoHocSinh.cccd
          }));
          setSelectNamHoc(infoHocSinh.idNamThi);
          setSelectHTDT(infoHocSinh.maHinhThucDaoTao);
          const danhmuc = await getByIdNamThi(infoHocSinh.idNamThi, infoHocSinh.maHinhThucDaoTao, user.username);
          if (danhmuc.data && danhmuc.data.length > 0) {
            const selectDanhmuc = danhmuc.data.find((item) => item.id === infoHocSinh.idDanhMucTotNghiep);
            setDMTN(danhmuc.data);
            setPageState((old) => ({
              ...old,
              DMTN: infoHocSinh.idDanhMucTotNghiep
            }));
            dispatch(selectedDanhmuc(selectDanhmuc));
          } else {
            setDMTN([]);
            setPageState((old) => ({ ...old, DMTN: '' }));
          }
          setLoadData(true);
        } catch (error) {
          console.error(error);
        }
      };
      setDisabled(true);
      fetchData();
    }
  }, [infoHocSinh, namHoc, htdt, donvis]);

  useEffect(() => {
    const fetchDataDL = async () => {
      const danhmuc = await getByIdNamThi(selectNamHoc, selectHTDT, user.username);
      if (danhmuc.data && danhmuc.data.length > 0) {
        setDMTN(danhmuc.data);
      } else {
        setDMTN([]);
        setPageState((old) => ({ ...old, DMTN: '' }));
      }
    };
    if (selectNamHoc && selectHTDT) {
      fetchDataDL();
    }
  }, [selectNamHoc, selectHTDT]);

  useEffect(() => {
    console.log(pageState);
  }, [pageState]);

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('idNamThi', pageState.namHoc);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('noiSinh', pageState.noiSinh);
      params.append('danToc', pageState.danToc);
      params.append('idDanhMucTotNghiep', pageState.DMTN);
      params.append('idTruong', pageState.donVi);
      params.append('nguoiThucHien', user.username);
      const response = await getHocSinhXacMinhVanBang(params);
      const check = handleResponseStatus(response, navigate);
      const data = await response.data;
      if (check) {
        if (data && data.hocSinhs.length > 0) {
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang ? row.soHieuVanBang : 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            ngaySinh_fm: convertISODateToFormattedDate(row.ngaySinh),
            ...row
          }));
          dispatch(setReloadData(false));
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: dataWithIds,
            total: data.totalRow || 0
          }));
        } else {
          setPageState((old) => ({
            ...old,
            isLoading: false,
            data: [],
            total: 0
          }));
        }
      } else {
        setIsAccess(false);
      }
    };
    if (!firstLoad || loadData) {
      if (loadData) {
        fetchData();
        setLoadData(false);
        dispatch(setInfoHocSinh(null));
      } else {
        fetchData();
      }
    } else {
      setFirstLoad(false);
    }
  }, [pageState.search, pageState.order, pageState.orderDir, pageState.startIndex, pageState.pageSize, reloadData, search, loadData]);

  const handleNamHocChange = (event) => {
    const selectedValue = event.target.value;
    const NamHocId = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, namHoc: NamHocId }));
    setSelectNamHoc(selectedValue);
  };

  const handleHTDTChange = (event) => {
    const selectedValue = event.target.value;
    setSelectHTDT(selectedValue);
  };

  const handleDanhMucChange = (event) => {
    const selectedValue = event.target.value;
    setPageState((old) => ({ ...old, DMTN: selectedValue }));
  };

  const handleSchoolChange = (event) => {
    const selectedValue = event.target.value;
    const truongId = selectedValue === 'all' ? '' : selectedValue;
    setPageState((old) => ({ ...old, donVi: truongId }));
  };

  useEffect(() => {
    const fetchDataDL = async () => {
      const updatedPageState = { ...pageState, pageSize: -1 };
      const params = await createSearchParams(updatedPageState);
      params.append('idTruong', selectDonvi);
      params.append('idDanhMucTotNghiep', selectDanhmuc);
      params.append('trangThai', pageState.trangThai ? pageState.trangThai : 2);
    };
    if (!firstLoad1 || loadData) {
      if (loadData) {
        fetchDataDL();
        setLoadData(false);
        dispatch(setInfoHocSinh(null));
      } else {
        fetchDataDL();
      }
    } else {
      setFirstLoad1(false);
    }
  }, [search, reloadData, loadData]);

  return (
    <>
      <MainCard title={t('tracuuvanbang.title')}>
        <Grid item container mb={1} spacing={1} justifyContent={'center'}>
          <Grid item md={3} sm={3} lg={1.2} xs={isXs ? 5 : 1.5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('namhoc')}</InputLabel>
              <Select name="truongId" value={selectNamHoc === '' ? 'all' : selectNamHoc} onChange={handleNamHocChange} label={t('Năm học')}>
                <MenuItem value="all">Tất cả</MenuItem>
                {namHoc && namHoc.length > 0 ? (
                  namHoc.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={3.5} sm={3.5} lg={2.5} xs={isXs ? 7 : 2.5}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('hinhthucdaotao.title')}</InputLabel>
              <Select name="truongId" value={selectHTDT} onChange={handleHTDTChange} label={t('hinhthucdaotao.title')}>
                {htdt && htdt.length > 0 ? (
                  htdt.map((data) => (
                    <MenuItem key={data.ma} value={data.ma}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} sm={6} lg={3} xs={isXs ? 12 : 3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('danhmuc.title')}</InputLabel>
              <Select name="id" value={pageState.DMTN ? pageState.DMTN : ''} onChange={handleDanhMucChange} label={t('danhmuc.title')}>
                {dMTN && dMTN.length > 0 ? (
                  dMTN.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.tieuDe}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('selected.nodata')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={6} sm={6} lg={4} xs={isXs ? 12 : 4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>{t('donvitruong.title')}</InputLabel>
              <Select
                name="truongId"
                value={pageState.donVi === '' ? 'all' : pageState.donVi}
                onChange={handleSchoolChange}
                label={t('donvitruong.title')}
              >
                <MenuItem value="all">Tất cả</MenuItem>
                {donvis && donvis.length > 0 ? (
                  donvis.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.ten}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="nodata">{t('noRowsLabel')}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item container spacing={1} justifyContent={'center'}>
            <Grid item md={6} sm={6} lg={3} container xs={isXs ? 12 : 3}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.fullname')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, hoTen: e.target.value }))}
                value={pageState.hoTen}
              />
            </Grid>
            <Grid item md={6} sm={6} lg={3} container xs={isXs ? 12 : 3}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.address')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, noiSinh: e.target.value }))}
                value={pageState.noiSinh}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} container xs={isXs ? 6 : 2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.cccd')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, cccd: e.target.value }))}
                value={pageState.cccd}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} container xs={isXs ? 6 : 2}>
              <TextField
                fullWidth
                id="outlined-basic"
                label={t('hocsinh.field.nation')}
                variant="outlined"
                size="small"
                onChange={(e) => setPageState((old) => ({ ...old, danToc: e.target.value }))}
                value={pageState.danToc}
              />
            </Grid>
            <Grid item md={4} sm={4} lg={2} xs={isXs ? 6 : 4}>
              <Button
                variant="contained"
                title={t('button.search')}
                fullWidth
                onClick={handleSearch}
                color="info"
                sx={{ marginTop: '2px' }}
                startIcon={<IconSearch />}
              >
                {t('button.search')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justifyContent="flex-end" spacing={1} mb={1}>
          <Grid item>
            {existingHocSinhs.length > 0 && (
              <Button variant="contained" color="error" onClick={handleDeleteDanhSachXacMinh} startIcon={<IconTrash />}>
                {t('Xóa ' + existingHocSinhs.length + ' học sinh')}
              </Button>
            )}
          </Grid>
          <Grid item>
            {existingHocSinhs.length > 0 && (
              <ButtonSuccess
                title={t('xác minh ' + existingHocSinhs.length + ' học sinh')}
                fullWidth
                onClick={handleXacMinhNhieuNguoi}
                icon={IconChecks}
              />
            )}
          </Grid>
        </Grid>
        <DataGrid
          autoHeight
          columns={columns}
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[5, 10, 20]}
          rowHeight={60}
          pagination
          page={pageState.startIndex}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, startIndex: newPage }));
          }}
          onPageSizeChange={(newPageSize) => {
            setPageState((old) => ({ ...old, pageSize: newPageSize }));
          }}
          onSortModelChange={(newSortModel) => {
            const field = newSortModel[0]?.field;
            const sort = newSortModel[0]?.sort;
            setPageState((old) => ({ ...old, order: field, orderDir: sort }));
          }}
          onFilterModelChange={(newSearchModel) => {
            const value = newSearchModel.items[0]?.value;
            setPageState((old) => ({ ...old, search: value }));
          }}
          localeText={language === 'vi' ? localeText : null}
          disableSelectionOnClick={true}
          //checkboxSelection
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            setSelectedRowData(pageState.data.filter((row) => selectedIDs.has(row.id)));
          }}
        />
      </MainCard>
      {form !== '' && (
        <Popup
          title={title}
          form={form}
          openPopup={openPopup}
          maxWidth={form === 'xemlichsu' || form === 'chinhsuavbcc' || form === 'caplaivbcc' ? 'lg' : form === 'deleteall' ? 'sm' : 'md'}
          bgcolor={form === 'delete' || form === 'deleteall' ? '#F44336' : '#2196F3'}
        >
          {form === 'detail' ? (
            <Detail />
          ) : form == 'xacminh' ? (
            <Xacminhtungnguoi />
          ) : form == 'deleteall' ? (
            <DeleteDanhSachXacMinh />
          ) : form == 'xemlichsu' ? (
            <LichSuXacMinh />
          ) : form == 'xemlichsuhuybo' ? (
            <LichSuThuHoi />
          ) : form == 'xacminhnhieunguoi' ? (
            <Xacminhnhieunguoi />
          ) : form == 'chinhsuavbcc' ? (
            <ChinhSuaVBCC />
          ) : form == 'thuhoi' ? (
            <Thuhoihuybo />
          ) : form == 'caplaivbcc' ? (
            <CapLaiVBCC />
          ) : (
            ''
          )}
        </Popup>
      )}
      <BackToTop />
    </>
  );
}
