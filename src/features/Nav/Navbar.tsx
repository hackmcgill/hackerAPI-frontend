// import { Box } from '@rebass/grid';
import * as React from 'react';
import * as CONSTANTS from '../../config/constants';

import { slide as Menu } from 'react-burger-menu';
import { Hacker, Account } from '../../api';
import Martlet from '../../assets/images/mchacks-martlet-tight.svg';
import { FrontendRoute as routes, HackerStatus, UserType } from '../../config';
// import { Image } from '../../shared/Elements';
import {
  isLoggedIn,
  canAccessTravel,
  // getSponsorInfo,
} from '../../util/UserInfoHelperFunctions';
import { isConfirmed } from '../../util/UserInfoHelperFunctions';
import Burger from './Burger';
import Icon from './Icon';
import IconContainer from './IconContainer';
import Links from './Links';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Nav from './Nav';
import NavLink from './NavLink';

interface INavbarProps {
  activePage: string;
}

interface INavbarState {
  loggedIn: boolean;
  status: HackerStatus;
  confirmed: boolean;
  loaded: boolean;
  showTravelLink: boolean;
  userType: UserType;
  // hasSponsorInfo: boolean;
}

export default class Navbar extends React.Component<
  INavbarProps,
  INavbarState
> {
  constructor(props: INavbarProps) {
    super(props);
    this.state = {
      loggedIn: false,
      status: HackerStatus.HACKER_STATUS_NONE,
      confirmed: true,
      loaded: false,
      showTravelLink: false,
      userType: UserType.UNKNOWN,
      // hasSponsorInfo: false,
    };
    this.checkLoggedIn();
  }

  public async componentDidMount() {
    let hacker;

    // set hacker status
    try {
      const response = await Hacker.getSelf();
      hacker = response.data.data;
      this.setState({
        status: hacker.status,
        showTravelLink: canAccessTravel(hacker),
      });
    } catch (e) {
      if (e === undefined || e.status === 401) {
        this.setState({
          status: HackerStatus.HACKER_STATUS_NONE,
          showTravelLink: false,
        });
      }
    }
    try {
      const response = await Account.getSelf();
      const account = response.data.data;
      this.setState({
        userType: account.accountType,
      });
    } catch (e) {
      // do nothing
    }

    // try {
    //   const response = await getSponsorInfo();
    //   if (response !== null) {
    //     this.setState({ hasSponsorInfo: true });
    //   }
    // } catch (e) {
    //   // do nothing
    // }

    // set confirmed account
    try {
      const confirmed = await isConfirmed();
      this.setState({ confirmed });
    } catch (e) {
      this.setState({ confirmed: false });
    }
    this.setState({ loaded: true });
  }

  public render() {
    const {
      loggedIn,
      status,
      confirmed,
      userType,
      // hasSponsorInfo,
    } = this.state;

    const CTAButton = loggedIn ? <LogoutButton /> : <LoginButton />;

    let appRoute;
    if (status === HackerStatus.HACKER_STATUS_NONE && confirmed) {
      appRoute = routes.CREATE_APPLICATION_PAGE;
    } else {
      appRoute = routes.EDIT_APPLICATION_PAGE;
    }
    // let sponsorRoute;
    // if (hasSponsorInfo) {
    //   sponsorRoute = routes.EDIT_SPONSOR_PAGE;
    // } else {
    //   sponsorRoute = routes.CREATE_SPONSOR_PAGE;
    // }

    const route: any[] = [
      routes.HOME_PAGE,
      routes.EDIT_ACCOUNT_PAGE,
      appRoute,
      routes.TRAVEL_PAGE,
      routes.ADMIN_SEARCH_PAGE,
      routes.SPONSOR_SEARCH_PAGE,
      // sponsorRoute,
    ];

    let NavItems = () => <></>;
    if (loggedIn === true) {
      NavItems = () => (
        <>
          <NavLink
            href={route[0]}
            className={this.props.activePage === 'home' ? 'active' : ''}
          >
            Home
          </NavLink>
          <NavLink
            href={route[1]}
            className={this.props.activePage === 'profile' ? 'active' : ''}
          >
            Profile
          </NavLink>
          {Date.now() < CONSTANTS.APPLICATION_CLOSE_TIME ||
          status !== HackerStatus.HACKER_STATUS_NONE ? (
            <NavLink
              href={route[2]}
              className={
                this.props.activePage === 'application' ? 'active' : ''
              }
            >
              Application
            </NavLink>
          ) : null}
          {this.state.showTravelLink ? (
            <NavLink
              href={route[3]}
              className={this.props.activePage === 'travel' ? 'active' : ''}
            >
              Travel
            </NavLink>
          ) : null}
          {userType === UserType.STAFF ||
          userType === UserType.SPONSOR_T1 ||
          userType === UserType.SPONSOR_T2 ||
          userType === UserType.SPONSOR_T3 ||
          userType === UserType.SPONSOR_T4 ||
          userType === UserType.SPONSOR_T5 ? (
            userType !== UserType.STAFF ? (
              <>
                <NavLink
                  href={route[5]}
                  className={this.props.activePage === 'search' ? 'active' : ''}
                >
                  Search
                </NavLink>
                <NavLink
                  href={'https://mchacks.ca/sponsor-info'}
                  className={''}
                >
                  Info
                </NavLink>
              </>
            ) : (
              <NavLink
                href={route[4]}
                className={this.props.activePage === 'search' ? 'active' : ''}
              >
                Search
              </NavLink>
            )
          ) : null}
          {userType === UserType.STAFF ? (
            <NavLink
              href={routes.SETTINGS_PAGE}
              className={this.props.activePage === 'settings' ? 'active' : ''}
            >
              Settings
            </NavLink>
          ) : (
            <div />
          )}
        </>
      );
    }

    // i want to check if this is the login page or not, how to do it??
    return this.state.loaded && loggedIn ? (
      <Nav borderThickness={'2px'}>
        <IconContainer>
          <a href={routes.HOME_PAGE}>
            <Icon src={Martlet} />
          </a>
        </IconContainer>
        <Links>
          {NavItems()}
          {CTAButton}
        </Links>
        <Menu isOpen={true} styles={Burger}>
          {NavItems()}
          {CTAButton}
        </Menu>
      </Nav>
    ) : null;
  }
  private checkLoggedIn() {
    isLoggedIn().then((result) => {
      this.setState({
        loggedIn: result,
      });
    });
  }
}
