import React from 'react';
import UCSBOrganizationTable from 'main/components/UCSBOrganizations/UCSBOrganizationTable';
import { ucsbOrganizationFixtures } from 'fixtures/ucsbOrganizationFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/UCSBOrganizations/UCSBOrganizationTable',
    component: UCSBOrganizationTable
};

const Template = (args) => {
    return (
        <UCSBOrganizationTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    ucsbOrganizations: []
};

export const TwoOrgsOrdinaryUser = Template.bind({});

TwoOrgsOrdinaryUser.args = {
    ucsbOrganizations: ucsbOrganizationFixtures.twoOrgs,
    currentUser: currentUserFixtures.userOnly,
};

export const TwoOrgsAdminUser = Template.bind({});
TwoOrgsAdminUser.args = {
    ucsbOrganizations: ucsbOrganizationFixtures.twoOrgs,
    currentUser: currentUserFixtures.adminUser,
}

TwoOrgsAdminUser.parameters = {
    msw: [
        rest.delete('/api/ucsborganizations', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
