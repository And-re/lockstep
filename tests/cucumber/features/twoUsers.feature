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

  Scenario: Changing team privacy
    Given Bob should see the team is not private
    And Alice checks the private checkbox
    Then Bob should see the team is private

  Scenario: One user starts and waits
#    When Bob adds a task
    When Bob clicks start
    Then Bob should not see the timer

  Scenario: Both users clicked start
    When Alice clicks start
    Then Bob should see the timer
    And Alice should see the timer
    And Bob should have the timer decreasing using "workTime"
    And Bob should have the timer decreasing using "shortRestTime"
    And Alice waits for the "Start Work Phase 2" button
    And Alice clicks start
    And Bob clicks start
    And Bob should have the timer decreasing using "workTime"
    And Bob should have the timer decreasing using "shortRestTime"
    And Alice waits for the "Start Work Phase 3" button
    And Alice clicks start
    And Bob clicks start
    And Bob should have the timer decreasing using "workTime"
    And Bob should have the timer decreasing using "longRestTime"
