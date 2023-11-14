import { Button, Card, Grid, TextField, useMediaQuery } from '@mui/material';
// import { Button, Grid, TextField, useMediaQuery } from '@mui/material';
import { IconCertificate, IconEdit, IconSearch } from '@tabler/icons';
import React from 'react';
import ThongKeSoBangDaPhatChuaPhat from './SoBangDaPhatChuaPhat';
import ThongKeSoLuongXepLoai from './SoLuongXepLoai';
import ThongKeSoLuongNguoiHoc from './SoLuongHocSinh';
import MainCard from 'components/cards/MainCard';
import { useState } from 'react';
import { useEffect } from 'react';
import { GetTraCuuHocSinhTotNghiep } from 'services/thongkeService';
import { donviSelector, openPopupSelector, reloadDataSelector, userLoginSelector } from 'store/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import useLocalText from 'utils/localText';
import { DataGrid } from '@mui/x-data-grid';
import { selectedHocsinh, setCapBangBanSao, setOpenPopup, setReloadData } from 'store/actions';
import CombinedActionButtons from 'components/button/CombinedActionButtons';
import i18n from 'i18n';
import { createSearchParams } from 'utils/createSearchParams';
import { handleResponseStatus } from 'utils/handleResponseStatus';
import { convertISODateToFormattedDate } from 'utils/formatDate';
import BackToTop from 'components/scroll/BackToTop';
import ThongKePhong from './ThongKePhong';
import ThongKeTruong from './ThongKeTruong';
import Popup from 'components/controls/popup';
import ActionButtons from 'components/button/ActionButtons';
import '../../index.css';
import ChinhSuaVBCC from 'views/chinhsuavbcc/ChinhSuaVBCC';
import Thuhoihuybo from 'views/thuhoihuybo/Thuhoihuybo';
import ShowVanBang from './ShowVanBang';
import InBanSao from './InBanSao';
import XacNhanIn from './XacNhanIn';

// import { Component } from 'react';

// class Demo extends Component {
//   constructor(props) {
//     super(props);
//     // Don't do this!
//     this.state = { color: 'green' };
//   }

//   UNSAFE_componentWillMount() {
//     console.log('componentWillMount da chay');
//   }

//   componentDidMount() {
//     console.log('componentDidMount da chay');
//   }

//   render() {
//     console.log('Ham render da duoc chay');
//     return (
//       <div>
//         <button onClick={() => this.setState({ color: 'aaaaa' })}>Submit</button>
//         <p>{this.state.color}</p>
//       </div>
//     );
//   }
// }

const TrangChu = () => {
  const isXs = useMediaQuery('(max-width:800px)');
  const language = i18n.language;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localeText = useLocalText();
  const reloadData = useSelector(reloadDataSelector);
  const donvi = useSelector(donviSelector);
  const [search, setSearch] = useState(false);
  const openPopup = useSelector(openPopupSelector);
  const [title, setTitle] = useState('');
  const [form, setForm] = useState('');
  const user = useSelector(userLoginSelector);
  const [hsSoGoc, setHsSoGoc] = useState([]);

  const [pageState, setPageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    order: 1,
    orderDir: 'ASC',
    startIndex: 0,
    pageSize: 10,
    cccd: '',
    hoTen: ''
  });

  const handleShowVanBang = (hocsinh) => {
    setTitle(t('Thông tin văn bằng'));
    setForm('showvanbang');
    setHsSoGoc(hocsinh);
    dispatch(setOpenPopup(true));
  };

  const handleChinhSuaVBCC = (hocsinh) => {
    setTitle(t('Chỉnh sửa văn bằng chứng chỉ'));
    setForm('chinhsuavbcc');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handleThuHoiHuyBo = (hocsinh) => {
    setTitle(t('Thu hồi hủy bỏ văn bằng chứng chỉ'));
    setForm('thuhoi');
    dispatch(selectedHocsinh(hocsinh));
    dispatch(setOpenPopup(true));
  };

  const handlePreview = (donyeucau) => {
    setTitle(t('In Bản sao '));
    setForm('inbang');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };
  const handleXacNhanIn = (donyeucau) => {
    setTitle(t('Xác Nhận In'));
    setForm('xacnhanin');
    dispatch(setCapBangBanSao(donyeucau));
    dispatch(setOpenPopup(true));
  };

  const capbangsao = [
    {
      type: 'capbansao',
      handleClick: handlePreview
    },
    {
      type: 'xacnhanin',
      handleClick: handleXacNhanIn
    }
  ];

  const chinhsuavb = [
    {
      type: 'chinhsuavbcc',
      handleClick: handleChinhSuaVBCC
    },
    {
      type: 'thuhoi',
      handleClick: handleThuHoiHuyBo
    }
  ];

  const columns = [
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
      minWidth: 180
    },
    {
      field: 'cccd',
      headerName: t('hocsinh.field.cccd'),
      flex: 1.3,
      minWidth: 100
    },
    {
      field: 'gioiTinh_fm',
      headerName: t('hocsinh.field.gender'),
      flex: 1,
      minWidth: 70
    },
    {
      field: 'ngaySinh_fm',
      headerName: t('hocsinh.field.bdate'),
      flex: 1.3,
      minWidth: 95
    },
    {
      field: 'soHieuVanBang',
      headerName: t('hocsinh.field.soHieu'),
      flex: 1.5,
      minWidth: 110
    },
    {
      field: 'soVaoSoCapBang',
      headerName: t('hocsinh.field.soCapBang'),
      flex: 1.7,
      minWidth: 130
    },
    {
      field: 'trangThai_fm',
      headerName: t('Trạng thái'),
      flex: 1.5,
      minWidth: 110
    },
    {
      field: 'actions',
      headerName: t('action'),
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Grid container justifyContent="center" spacing={1}>
            <Grid item>
              {params.row.donYeuCauCapBanSao != null ? (
                <CombinedActionButtons
                  params={params.row}
                  buttonConfigurations={capbangsao}
                  icon={IconCertificate}
                  title={'Cấp bằng bản sao'}
                />
              ) : (
                <ActionButtons type="showvanbang" handleClick={handleShowVanBang} params={params.row} />
              )}
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
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setPageState((old) => ({ ...old, isLoading: true }));
      const params = await createSearchParams(pageState);
      params.append('cccd', pageState.cccd);
      params.append('hoTen', pageState.hoTen);
      params.append('nguoiThucHien', user ? user.username : '');
      const response = await GetTraCuuHocSinhTotNghiep(params);
      const check = handleResponseStatus(response, navigate);
      if (check) {
        const data = await response.data;
        if (response.data && response.data.hocSinhs.length > 0) {
          const trangThaiMapping = {
            1: t('Chưa duyệt'),
            2: t('Đã duyệt'),
            3: t('Đã vào sổ gốc'),
            4: t('Đã cấp bằng'),
            5: t('Đã in bằng'),
            6: t('Đã phát bằng')
          };
          const dataWithIds = data.hocSinhs.map((row, index) => ({
            idx: pageState.startIndex * pageState.pageSize + index + 1,
            soHieuVanBang: row.soHieuVanBang || 'Chưa cấp',
            soVaoSoCapBang: row.soVaoSoCapBang || 'Chưa cấp',
            gioiTinh_fm: row.gioiTinh ? t('gender.male') : t('gender.female'),
            trangThai_fm: trangThaiMapping[row.trangThai] || 'Không xác định',
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
    if (search || reloadData) {
      if (pageState.cccd || pageState.hoTen) {
        fetchData();
      } else {
        setPageState((old) => ({
          ...old,
          isLoading: false,
          data: [],
          total: 0
        }));
      }
      setSearch(false);
    }
  }, [reloadData, search]);

  const handleSearch = () => {
    setSearch(true);
  };
  return (
    <>
      {/* <Demo></Demo> */}
      {donvi === 0 ? (
        <div className="wrapper">
          <svg>
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">
              Chào mừng bạn đến với quản trị hế thống
            </text>
          </svg>
        </div>
      ) : (
        <>
          {' '}
          {donvi.laPhong && (
            <Grid mb={2}>
              <MainCard title={t('Tìm kiếm nhanh')}>
                <Grid item container spacing={1} mb={2} justifyContent={'center'}>
                  <Grid item lg={2} md={3} sm={3} xs={isXs ? 4 : 2}>
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
                  <Grid item lg={4} md={6} sm={6} xs={isXs ? 8 : 4}>
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
                  <Grid item lg={2} md={3} sm={3} xs={isXs ? 6 : 2} minWidth={130}>
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
                <DataGrid
                  autoHeight
                  columns={columns}
                  rows={pageState.data}
                  loading={pageState.isLoading}
                  rowHeight={60}
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
                  hideFooterPagination={true}
                  hideFooter={true} // Ẩn phần footer
                />
              </MainCard>
            </Grid>
          )}
          {donvi.laPhong ? <ThongKePhong /> : <ThongKeTruong />}
          {donvi.laPhong ? (
            <>
              <Card sx={{ mt: 2 }}>
                <Grid container item xs={12} justifyContent={'center'}>
                  <Grid item xs={12}>
                    <ThongKeSoLuongNguoiHoc />
                  </Grid>
                </Grid>
              </Card>
              <Grid item xs={12} mt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <ThongKeSoLuongXepLoai />
                  </Grid>
                  <Grid item xs={12} lg={6} md={6} sm={12}>
                    <ThongKeSoBangDaPhatChuaPhat />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            ''
          )}
          {form !== '' && (
            <Popup title={title} form={form} openPopup={openPopup} maxWidth={'md'} bgcolor={'#2196F3'}>
              {form === 'showvanbang' ? (
                <ShowVanBang duLieuHocSinh={hsSoGoc} />
              ) : form === 'inbang' ? (
                <InBanSao />
              ) : form === 'xacnhanin' ? (
                <XacNhanIn />
              ) : form == 'chinhsuavbcc' ? (
                <ChinhSuaVBCC />
              ) : form == 'thuhoi' ? (
                <Thuhoihuybo />
              ) : (
                ''
              )}
            </Popup>
          )}
          <BackToTop />
        </>
      )}
    </>
  );
};

export default TrangChu;
