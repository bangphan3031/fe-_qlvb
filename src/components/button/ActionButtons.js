import React from 'react';
import { Tooltip, ListItemIcon, MenuItem, Typography, IconButton } from '@mui/material';
import {
  IconEdit,
  IconUsers,
  IconTrash,
  IconLockOff,
  IconCheckbox,
  IconHandMove,
  IconList,
  IconCalendar,
  IconEyeCheck,
  IconSettings,
  IconBrandTelegram,
  IconCooker,
  IconArchive,
  IconBook,
  IconEye,
  IconCertificate,
  IconPrinter,
  IconChecks,
  IconEyeOff,
  IconFileCertificate,
  IconUserCheck,
  IconHistory,
  IconSquareRoundedPlus,
  IconCurrencyEuro,
  IconCertificateOff,
  IconCertificate2
} from '@tabler/icons';
import AnimateButton from 'components/extended/AnimateButton';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ActionButtons = ({
  menu,
  onClose,
  type,
  handleAdd,
  handleEdit,
  handleDelete,
  handleDeActive,
  handleActive,
  handleClick,
  params,
  title,
  handlePermission,
  handleGetbyId
}) => {
  const { t } = useTranslation();

  const getButtons = () => {
    switch (type) {
      case 'add':
        return [
          {
            title: title || 'button.title.action',
            icon: <IconUsers size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleAdd(params);
              onClose();
            }
          }
        ];
      case 'permissionGroup':
        return [
          {
            title: title || 'user.title.permissionGroup',
            icon: <IconUsers size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'permissionReport':
        return [
          {
            title: title || 'Thống kê',
            icon: <IconUsers size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xemtruoc':
        return [
          {
            title: title || 'button.title.action',
            icon: <IconEye size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'action':
        return [
          {
            title: title || 'button.title.action',
            icon: <IconHandMove size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleAdd(params);
              onClose();
            }
          }
        ];
      case 'edit':
        return [
          {
            title: 'button.title.edit',
            icon: <IconEdit size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleEdit(params);
              if (onClose) {
                onClose();
              }
            }
          }
        ];
      case 'delete':
        return [
          {
            title: 'button.title.delete',
            icon: <IconTrash color="red" size={'20px'} />,
            color: 'error',
            onClick: () => {
              handleDelete(params);
              onClose();
            }
          }
        ];
      case 'deActive':
        return [
          {
            title: 'button.title.deActive',
            icon: <IconLockOff color="red" size={'20px'} />,
            color: 'error',
            onClick: () => {
              handleDeActive(params);
              onClose();
            }
          }
        ];
      case 'permission':
        return [
          {
            title: 'button.title.permission',
            icon: <IconList size={'20px'} />,
            color: 'info',
            onClick: () => {
              handlePermission(params);
              onClose();
            }
          }
        ];
      case 'active':
        return [
          {
            title: 'button.title.active',
            icon: <IconCheckbox size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleActive(params);
              onClose();
            }
          }
        ];
      case 'calendar':
        return [
          {
            title: 'button.title.calendar',
            icon: <IconCalendar size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleAdd(params);
              onClose();
            }
          }
        ];
      case 'detail':
        return [
          {
            title: 'button.title.detail',
            icon: <IconEyeCheck size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleGetbyId(params);
              if (onClose) {
                onClose();
              }
            }
          }
        ];
      case 'showvanbang':
        return [
          {
            title: 'Xem văn bằng',
            icon: <IconCertificate size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
              if (onClose) {
                onClose();
              }
            }
          }
        ];
      case 'detailPhatBang':
        return [
          {
            title: 'Phát bằng',
            icon: <IconEyeCheck size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleGetbyId(params);
              if (onClose) {
                onClose();
              }
            }
          }
        ];
      case 'detailDonYeuCau':
        return [
          {
            title: 'Thuộc đơn yêu cầu',
            icon: <IconCurrencyEuro size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleGetbyId(params);
              if (onClose) {
                onClose();
              }
            }
          }
        ];
      case 'reset':
        return [
          {
            title: 'reset.password.title',
            icon: <IconBrandTelegram size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'config':
        return [
          {
            title: 'button.title.config',
            icon: <IconSettings size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'phoi':
        return [
          {
            title: 'button.title.diplomaembryo',
            icon: <IconCooker size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'inbang':
        return [
          {
            title: 'button.title.inbang',
            icon: <IconPrinter size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xacnhanin':
        return [
          {
            title: 'Xác nhận in',
            icon: <IconCheckbox size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xacnhanphatbansao':
        return [
          {
            title: 'Xác nhận phát bản sao',
            icon: <IconChecks size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xemlichsu':
        return [
          {
            title: 'Xem lịch sử',
            icon: <IconHistory size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xemlichsuxacminh':
        return [
          {
            title: 'Xem lịch sử xác minh',
            icon: <IconHistory size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xemlichsuhuybo':
        return [
          {
            title: 'Xem lịch sử thu hồi',
            icon: <IconHistory size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'xacminh':
        return [
          {
            title: 'Xác minh',
            icon: <IconCheckbox size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'addlist':
        return [
          {
            title: 'Thêm vào danh sách',
            icon: <IconSquareRoundedPlus size={'20px'} />,
            color: 'warning',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'huyphoi':
        return [
          {
            title: 'button.title.destroy',
            icon: <IconArchive color="red" size={'20px'} />,
            color: 'error',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'socapbang':
        return [
          {
            title: 'button.title.socapbang',
            icon: <IconBook size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'phatbang':
        return [
          {
            title: 'Phát bằng',
            icon: <IconCertificate size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'capbang':
        return [
          {
            title: 'Cấp bằng',
            icon: <IconCertificate size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
            }
          }
        ];
      case 'capbansao':
        return [
          {
            title: 'Cấp bản sao',
            icon: <IconFileCertificate size={'20px'} />,
            color: 'info',
            onClick: () => {
              handleClick(params);
            }
          }
        ];
      case 'duyet':
        return [
          {
            title: 'Duyệt học sinh',
            icon: <IconUserCheck size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
            }
          }
        ];
      case 'show':
        return [
          {
            title: 'Hiển thị tin tức',
            icon: <IconEye size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'chinhsuavbcc':
        return [
          {
            title: 'Chỉnh sửa VBCC',
            icon: <IconEdit size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'caplaivbcc':
        return [
          {
            title: 'Cấp lại VBCC',
            icon: <IconCertificate2 size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'thuhoi':
        return [
          {
            title: 'Thu hồi/hủy bỏ',
            icon: <IconCertificateOff size={'20px'} />,
            color: 'success',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      case 'hide':
        return [
          {
            title: 'Ẩn tin tức',
            icon: <IconEyeOff size={'20px'} />,
            color: 'secondary',
            onClick: () => {
              handleClick(params);
              onClose();
            }
          }
        ];
      default:
        return [];
    }
  };

  const buttons = getButtons();

  return (
    <>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {menu ? (
            <>
              {button.color === 'error' ? (
                <MenuItem key={index} onClick={button.onClick} border={1}>
                  <ListItemIcon>{button.icon}</ListItemIcon>
                  <div style={{ margin: '0 0 -4px -7px' }}>
                    <Typography variant="subtitle1" color="error" style={{ fontSize: '13px' }}>
                      {t(button.title)}
                    </Typography>
                  </div>
                </MenuItem>
              ) : (
                <MenuItem key={`${button.title}_${index}`} onClick={button.onClick}>
                  <ListItemIcon>{button.icon}</ListItemIcon>
                  <div style={{ margin: '0 0 -4px -7px' }}>
                    <Typography variant="subtitle1" style={{ fontSize: '13px' }}>
                      {t(button.title)}
                    </Typography>
                  </div>
                </MenuItem>
              )}
            </>
          ) : (
            <>
              <AnimateButton>
                <Tooltip title={t(button.title)} placement="bottom">
                  <IconButton color={button.color} key={index} onClick={button.onClick} style={{ border: '1px solid black' }} size="small">
                    {<VisibilityIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </AnimateButton>
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ActionButtons;
