@focus
Feature: Two users at the same time

  # The background will be run for every scenario
#  Background:

  Scenario: Creating two anonymous accounts works
    Given There are two users
    When Both go to "/"
    And Both go to "/focus"
    Then Alice should see her name in team panel
    And Alice should see the other person name in team panel
    And Bob should see his name in team panel
    And Bob should see the other person name in team panel
